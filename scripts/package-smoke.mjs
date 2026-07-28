import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("package:smoke must be run through npm so npm_execpath is available.");
const temp = await mkdtemp(path.join(os.tmpdir(), "honest-ci-package-smoke-"));
let tarball;

function run(command, args, cwd, options = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    shell: false,
    windowsHide: true,
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error([
      `Command failed (${result.status}): ${command} ${args.join(" ")}`,
      result.stdout,
      result.stderr,
    ].filter(Boolean).join("\n"));
  }
  return result.stdout.trim();
}

function runNpm(args, cwd) {
  return run(process.execPath, [npmCli, ...args], cwd);
}

try {
  const packed = JSON.parse(runNpm(["pack", "--ignore-scripts", "--json"], root));
  const filename = packed[0]?.filename;
  if (typeof filename !== "string") throw new Error("npm pack did not return a tarball filename.");
  const packedFiles = new Set(packed[0]?.files?.map((entry) => entry.path));
  for (const required of [
    "dist/cli/index.js",
    "dist/action/index.js",
    "README.md",
    "README.zh-TW.md",
    "README.zh-CN.md",
    "README.ja.md",
    "launch/DEMO.md",
    "launch/assets/false-green-before-after.png",
  ]) {
    if (!packedFiles.has(required)) throw new Error(`Packed tarball is missing ${required}.`);
  }
  tarball = path.join(root, filename);

  runNpm(["init", "-y"], temp);
  runNpm(["install", "--ignore-scripts", "--no-audit", "--no-fund", tarball], temp);

  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  const version = runNpm(["exec", "--", "honest-ci", "--version"], temp);
  if (version !== packageJson.version) {
    throw new Error(`Installed CLI reported ${version}; expected ${packageJson.version}.`);
  }

  await mkdir(path.join(temp, "reports"), { recursive: true });
  await writeFile(path.join(temp, "honest-ci.yml"), `version: 1
reports:
  - name: smoke
    paths: [reports/junit.xml]
    format: junit
    min_tests: 1
`, "utf8");
  await writeFile(path.join(temp, "reports", "junit.xml"), '<testsuite tests="1" failures="0" errors="0" skipped="0"/>\n', "utf8");

  const checked = JSON.parse(runNpm(["exec", "--", "honest-ci", "check", "--config", "honest-ci.yml", "--format", "json"], temp));
  if (checked.status !== "passed" || checked.totals?.tests !== 1) {
    throw new Error(`Installed CLI smoke check returned an unexpected result: ${JSON.stringify(checked)}`);
  }

  console.log(`Package smoke passed: ${filename}, CLI ${version}, 1 JUnit test observed.`);
} finally {
  if (tarball) await rm(tarball, { force: true });
  await rm(temp, { recursive: true, force: true });
}
