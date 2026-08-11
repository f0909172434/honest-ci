import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const repository = process.cwd();
const cli = path.join(repository, "dist", "cli", "index.js");
const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "honest-ci-scenarios-"));

function config({ paths = ["reports/junit.xml"], maxDropPercent = null } = {}) {
  return `version: 1
reports:
  - name: unit
    paths: [${paths.map((entry) => JSON.stringify(entry)).join(", ")}]
    format: junit
    min_tests: 1
    max_drop_percent: ${maxDropPercent === null ? "null" : maxDropPercent}
    max_skipped_percent: null
baseline:
  file: .honest-ci/baseline.json
  source: default-branch
workflows:
  paths: [.github/workflows/*.yml]
`;
}

function writeReport(relative, xml) {
  return [
    process.execPath,
    "-e",
    `const fs=require("node:fs"),p=require("node:path"),f=${JSON.stringify(relative)};fs.mkdirSync(p.dirname(f),{recursive:true});fs.writeFileSync(f,${JSON.stringify(`${xml}\n`)})`,
  ];
}

const scenarios = [
  {
    name: "tests silently not running",
    expectedCode: "HCI001_MISSING_REPORT",
    command: [process.execPath, "-e", "console.log('test runner: selected no test files and exited 0')"],
  },
  {
    name: "zero tests",
    expectedCode: "HCI004_ZERO_TESTS",
    command: writeReport("reports/junit.xml", '<testsuite name="empty" tests="0" failures="0" errors="0" skipped="0"/>'),
  },
  {
    name: "misconfigured report path",
    expectedCode: "HCI001_MISSING_REPORT",
    command: writeReport("reports/actual.xml", '<testsuite name="actual" tests="3"/>'),
  },
  {
    name: "stale report",
    expectedCode: "HCI003_STALE_REPORT",
    beforeReport: '<testsuite name="old" tests="8"/>',
    command: [process.execPath, "-e", "console.log('test runner: exited 0 without touching the old report')"],
  },
  {
    name: "unexpected test-count drop",
    expectedCode: "HCI008_BASELINE_DROP",
    maxDropPercent: 10,
    baselineTests: 10,
    command: writeReport("reports/junit.xml", '<testsuite name="reduced" tests="7"/>'),
  },
  {
    name: "failing tests in JUnit",
    expectedCode: "HCI006_TEST_FAILURES",
    command: writeReport("reports/junit.xml", '<testsuite name="failed" tests="2" failures="1" errors="0" skipped="0"/>'),
  },
  {
    name: "overlapping discovery globs",
    expectedCode: null,
    paths: ["reports/**/*.xml", "reports/nested/junit.xml"],
    expectedTests: 3,
    command: writeReport("reports/nested/junit.xml", '<testsuite name="nested" tests="3" failures="0" errors="0" skipped="0"/>'),
  },
];

async function runScenario(scenario) {
  const workspace = path.join(temporaryRoot, scenario.name.replaceAll(/[^a-z0-9]+/gi, "-").toLowerCase());
  await mkdir(workspace, { recursive: true });
  await writeFile(
    path.join(workspace, "honest-ci.yml"),
    config({ paths: scenario.paths, maxDropPercent: scenario.maxDropPercent }),
    "utf8",
  );

  if (scenario.beforeReport) {
    await mkdir(path.join(workspace, "reports"), { recursive: true });
    await writeFile(path.join(workspace, "reports", "junit.xml"), `${scenario.beforeReport}\n`, "utf8");
  }
  if (scenario.baselineTests !== undefined) {
    await mkdir(path.join(workspace, ".honest-ci"), { recursive: true });
    await writeFile(
      path.join(workspace, ".honest-ci", "baseline.json"),
      `${JSON.stringify({
        version: 1,
        generatedAt: "2026-08-11T00:00:00.000Z",
        reports: {
          unit: { tests: scenario.baselineTests, failures: 0, errors: 0, skipped: 0 },
        },
      }, null, 2)}\n`,
      "utf8",
    );
  }

  const result = spawnSync(
    process.execPath,
    [cli, "run", "--config", "honest-ci.yml", "--", ...scenario.command],
    { cwd: workspace, encoding: "utf8", shell: false, windowsHide: true },
  );
  if (result.error) throw result.error;
  const output = `${result.stdout}${result.stderr}`;
  const expectedExit = scenario.expectedCode ? 1 : 0;
  const hasExpectedCode = scenario.expectedCode === null || output.includes(scenario.expectedCode);
  const hasExpectedTests = scenario.expectedTests === undefined || output.includes(`Tests: ${scenario.expectedTests} `);
  if (result.status !== expectedExit || !hasExpectedCode || !hasExpectedTests) {
    throw new Error([
      `Scenario failed: ${scenario.name}`,
      `Expected exit ${expectedExit}${scenario.expectedCode ? ` with ${scenario.expectedCode}` : ""}; received ${result.status}.`,
      output,
    ].join("\n"));
  }

  const outcome = scenario.expectedCode ?? `PASSED (${scenario.expectedTests} tests, duplicate match counted once)`;
  console.log(`PASS  ${scenario.name}: ${outcome}`);
}

try {
  for (const scenario of scenarios) await runScenario(scenario);
  console.log(`\nAll ${scenarios.length} HonestCI scenarios reproduced the expected result.`);
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
