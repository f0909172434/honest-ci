import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const [wheelArgument, pythonArgument = process.env.PYTHON ?? "python"] = process.argv.slice(2);
if (!wheelArgument) {
  throw new Error("Usage: node scripts/rigorgraph-interop-smoke.mjs PATH_TO_RIGORGRAPH_WHEEL [PYTHON]");
}
const root = process.cwd();
const wheel = path.resolve(wheelArgument);
const cli = path.join(root, "dist", "cli", "index.js");
const temp = await mkdtemp(path.join(os.tmpdir(), "honest-ci-rigorgraph-interop-"));

function run(command, args, cwd, expected = 0) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    shell: false,
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== expected) {
    throw new Error(`Command exited ${result.status}; expected ${expected}: ${command} ${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  }
  return `${result.stdout}${result.stderr}`;
}

try {
  const honest = path.join(temp, "honest");
  const research = path.join(temp, "research");
  const venv = path.join(temp, "venv");
  await mkdir(path.join(honest, "reports"), { recursive: true });
  await writeFile(path.join(honest, "honest-ci.yml"), `version: 1
reports:
  - name: unit
    paths: [reports/junit.xml]
    format: junit
    min_tests: 1
`, "utf8");
  await writeFile(path.join(honest, "reports", "junit.xml"), '<testsuite tests="1" failures="0" errors="0" skipped="0"/>\n', "utf8");
  run(process.execPath, [cli, "check", "--config", "honest-ci.yml", "--evidence-output", ".honest-ci/evidence.json"], honest);

  run(pythonArgument, ["-m", "venv", venv], temp);
  const venvPython = process.platform === "win32"
    ? path.join(venv, "Scripts", "python.exe")
    : path.join(venv, "bin", "python");
  const rigorgraph = process.platform === "win32"
    ? path.join(venv, "Scripts", "rigorgraph.exe")
    : path.join(venv, "bin", "rigorgraph");
  run(venvPython, ["-m", "pip", "install", wheel], temp);
  run(rigorgraph, ["init", research], temp);
  const claim = path.join(temp, "claim.json");
  await writeFile(claim, JSON.stringify({
    id: "CLM-CI",
    statement: "The expected CI tests ran for this commit.",
    type: "empirical",
    status: "DRAFT",
    authors: ["Maintainer"],
  }), "utf8");
  run(rigorgraph, ["claim", "add", claim, "--path", research], temp);
  run(rigorgraph, ["evidence", "import", path.join(honest, ".honest-ci", "evidence.json"), "--claim", "CLM-CI", "--path", research], temp);
  const audit = JSON.parse(run(rigorgraph, ["audit", research, "--json"], temp));
  if (audit.status !== "PASS") throw new Error(`RigorGraph audit failed: ${JSON.stringify(audit)}`);
  const claims = (await readFile(path.join(research, ".rigorgraph", "claims.jsonl"), "utf8"))
    .trim().split("\n").map((line) => JSON.parse(line));
  if (claims[0]?.status !== "DRAFT") throw new Error("Bundle import changed claim status.");
  const report = path.join(temp, "report.html");
  run(rigorgraph, ["report", research, "--output", report], temp);
  if (!(await readFile(report, "utf8")).includes("honest-ci/check-result-v1")) {
    throw new Error("Offline report omitted the HonestCI bundle profile.");
  }
  const evidenceRecord = JSON.parse((await readFile(path.join(research, ".rigorgraph", "evidence.jsonl"), "utf8")).trim());
  await writeFile(path.join(research, evidenceRecord.path), "{}", "utf8");
  const tampered = run(rigorgraph, ["audit", research, "--json"], temp, 1);
  if (!tampered.includes("RG_HASH_MISMATCH")) throw new Error("Tampered bundle did not fail hash audit.");
  console.log("HonestCI -> RigorGraph interoperability smoke passed; claim stayed DRAFT and tampering failed.");
} finally {
  await rm(temp, { recursive: true, force: true });
}
