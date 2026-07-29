import { spawnSync } from "node:child_process";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const runner = path.join(root, "demo", "launch", "false-green-runner.mjs");
const cli = path.join(root, "dist", "cli", "index.js");
const reports = path.join(root, "demo", "launch", "reports");
const evidence = path.join(root, "demo", "launch", "evidence.json");

function run(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    shell: false,
    windowsHide: true,
  });
  if (result.error) throw result.error;
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

try {
  const before = run([runner]);
  if (before.status !== 0 || !before.output.includes("ordinary CI stays green")) {
    throw new Error(`Before demo did not reproduce a false-green exit:\n${before.output}`);
  }

  const after = run([
    cli,
    "run",
    "--config",
    "demo/launch/honest-ci.yml",
    "--evidence-output",
    "demo/launch/evidence.json",
    "--",
    process.execPath,
    runner,
  ]);
  if (after.status !== 1 || !after.output.includes("HCI004_ZERO_TESTS")) {
    throw new Error(`HonestCI demo did not block on HCI004_ZERO_TESTS:\n${after.output}`);
  }
  if (after.output.includes("HCI003_STALE_REPORT")) {
    throw new Error(`HonestCI demo unexpectedly used stale-report evidence:\n${after.output}`);
  }
  const bundle = JSON.parse(await readFile(evidence, "utf8"));
  if (bundle.result?.status !== "failed" || !bundle.result?.findings?.some((finding) => finding.code === "HCI004_ZERO_TESTS")) {
    throw new Error(`HonestCI demo did not preserve its failed result: ${JSON.stringify(bundle)}`);
  }

  console.log("Launch demo passed: ordinary runner exit 0; HonestCI exit 1 with HCI004_ZERO_TESTS.");
} finally {
  await rm(reports, { recursive: true, force: true });
  await rm(evidence, { force: true });
}
