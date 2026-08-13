import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { parse } from "yaml";

const root = process.cwd();
const markdownFiles = [
  "README.md",
  "README.zh-TW.md",
  "README.zh-CN.md",
  "README.ja.md",
  "docs/ADOPTION_GUIDE.md",
  "docs/CONFIGURATION.md",
  "docs/TECHNICAL_OVERVIEW.md",
];

function localLinks(source) {
  return [...source.matchAll(/!?(?:\[[^\]]*\])\(([^)]+)\)/g)]
    .map((match) => match[1]?.trim())
    .filter((target) => target && !/^(?:https?:|mailto:|#)/i.test(target))
    .map((target) => target.split("#", 1)[0]);
}

const readme = await readFile(path.join(root, "README.md"), "utf8");
const yamlBlocks = [...readme.matchAll(/```yaml\n([\s\S]*?)\n```/g)].map((match) => match[1]);
if (yamlBlocks.length < 2) throw new Error("README must contain config and workflow YAML examples.");

const config = parse(yamlBlocks[0]);
if (config?.version !== 1 || config?.reports?.[0]?.format !== "junit") {
  throw new Error("README configuration example does not parse as HonestCI v1 JUnit configuration.");
}

const workflow = parse(yamlBlocks[1]);
const steps = workflow?.jobs?.test?.steps;
if (!Array.isArray(steps)) throw new Error("README workflow example does not contain jobs.test.steps.");
const gate = steps.find((step) => step?.uses === "f0909172434/honest-ci@v1.0.4");
if (gate?.with?.config !== "honest-ci.yml" || !gate?.with?.command?.includes("outputFile.junit=reports/junit.xml")) {
  throw new Error("README workflow and report configuration paths are not aligned.");
}

for (const file of markdownFiles) {
  const source = await readFile(path.join(root, file), "utf8");
  for (const target of localLinks(source)) {
    await access(path.resolve(root, path.dirname(file), target));
  }
}

const temp = await mkdtemp(path.join(os.tmpdir(), "honest-ci-readme-baseline-"));
try {
  await writeFile(path.join(temp, "honest-ci.yml"), `version: 1
reports:
  - name: unit
    paths: [reports/junit.xml]
    format: junit
    min_tests: 1
    max_drop_percent: 10
    max_skipped_percent: null
baseline:
  file: .honest-ci/baseline.json
  source: default-branch
`, "utf8");
  await writeFile(path.join(temp, "write-report.mjs"), `import { mkdir, writeFile } from "node:fs/promises";
await mkdir("reports", { recursive: true });
await writeFile("reports/junit.xml", '<testsuite tests="3" failures="0" errors="0" skipped="0"/>\\n');
`, "utf8");

  const { spawnSync } = await import("node:child_process");
  const cli = path.join(root, "dist", "cli", "index.js");
  const run = spawnSync(process.execPath, [
    cli,
    "baseline",
    "write",
    "--config",
    "honest-ci.yml",
    "--",
    process.execPath,
    "write-report.mjs",
  ], { cwd: temp, encoding: "utf8", shell: false, windowsHide: true });
  if (run.error) throw run.error;
  if (run.status !== 0) throw new Error(`README baseline command failed (${run.status}):\n${run.stdout}\n${run.stderr}`);
  const baseline = JSON.parse(await readFile(path.join(temp, ".honest-ci", "baseline.json"), "utf8"));
  if (baseline?.reports?.unit?.tests !== 3) throw new Error("README baseline command did not record three tests.");
} finally {
  await rm(temp, { recursive: true, force: true });
}

console.log(`README docs verified: ${yamlBlocks.length} YAML blocks parsed, ${markdownFiles.length} files link-checked, baseline write passed.`);
