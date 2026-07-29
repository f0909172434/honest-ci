import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const version = process.env.HONEST_CI_VERSION;
if (!version || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
  throw new Error("HONEST_CI_VERSION must be an exact npm version.");
}

const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("registry:smoke must be run through npm.");
const registry = "https://registry.npmjs.org/";
const temp = await mkdtemp(path.join(os.tmpdir(), "honest-ci-registry-smoke-"));

function runNpm(args) {
  const result = spawnSync(process.execPath, [npmCli, ...args], {
    cwd: temp,
    encoding: "utf8",
    shell: false,
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error([
      `npm ${args.join(" ")} failed with exit ${result.status}`,
      result.stdout,
      result.stderr,
    ].filter(Boolean).join("\n"));
  }
  return result.stdout.trim();
}

try {
  runNpm(["init", "-y"]);
  runNpm([
    "install",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    "--package-lock=false",
    `--registry=${registry}`,
    `honest-ci@${version}`,
  ]);

  const installed = JSON.parse(await readFile(
    path.join(temp, "node_modules", "honest-ci", "package.json"),
    "utf8",
  ));
  if (installed.version !== version) {
    throw new Error(`Installed ${installed.version}; expected ${version}.`);
  }
  const reported = runNpm(["exec", "--", "honest-ci", "--version"]);
  if (reported !== version) throw new Error(`CLI reported ${reported}; expected ${version}.`);

  await mkdir(path.join(temp, "reports"));
  await writeFile(path.join(temp, "honest-ci.yml"), `version: 1
reports:
  - name: registry-smoke
    paths: [reports/junit.xml]
    format: junit
    min_tests: 1
`, "utf8");
  await writeFile(
    path.join(temp, "reports", "junit.xml"),
    '<testsuite tests="1" failures="0" errors="0" skipped="0"/>\n',
    "utf8",
  );

  const checked = JSON.parse(runNpm([
    "exec", "--", "honest-ci", "check",
    "--config", "honest-ci.yml",
    "--format", "json",
    "--evidence-output", ".honest-ci/evidence.json",
  ]));
  if (checked.status !== "passed" || checked.totals?.tests !== 1) {
    throw new Error(`Unexpected check result: ${JSON.stringify(checked)}`);
  }
  const evidence = JSON.parse(await readFile(
    path.join(temp, ".honest-ci", "evidence.json"),
    "utf8",
  ));
  if (evidence.format !== "rigorgraph-evidence-bundle" || evidence.result?.status !== "passed") {
    throw new Error(`Unexpected evidence bundle: ${JSON.stringify(evidence)}`);
  }

  console.log(`Registry smoke passed: honest-ci ${version}, one test, valid evidence bundle.`);
} finally {
  await rm(temp, { recursive: true, force: true });
}
