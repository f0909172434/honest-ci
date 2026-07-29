import * as core from "@actions/core";

import { checkReports } from "./check.js";
import { loadConfig } from "./config.js";
import { writeEvidenceBundle } from "./evidence.js";
import { loadTrustedBaseline } from "./github-baseline.js";
import { lintWorkflows } from "./lint.js";
import { snapshotReports } from "./report-files.js";
import { runShellCommand } from "./runner.js";
import type { CheckResult, Finding } from "./types.js";

function commandFailure(exitCode: number): Finding {
  return {
    code: "HCI010_COMMAND_FAILED",
    severity: "error",
    message: `The test command exited with code ${exitCode}.`,
  };
}

function annotate(finding: Finding): void {
  const properties: core.AnnotationProperties = { title: finding.code };
  if (finding.file !== undefined) properties.file = finding.file;
  if (finding.line !== undefined) {
    properties.startLine = finding.line;
    properties.endLine = finding.line;
  }
  if (finding.severity === "error") core.error(finding.message, properties);
  else core.warning(finding.message, properties);
}

async function summary(result: CheckResult, evidencePath?: string): Promise<void> {
  if (!process.env.GITHUB_STEP_SUMMARY) return;
  const rows: Array<Array<{ data: string; header?: boolean }>> = [
    ["Report", "Tests", "Failures", "Errors", "Skipped", "Baseline", "Drop"].map((data) => ({ data, header: true })),
    ...result.reports.map((report) => [
      report.name,
      String(report.tests),
      String(report.failures),
      String(report.errors),
      String(report.skipped),
      report.baselineTests === null ? "—" : String(report.baselineTests),
      report.dropPercent === null ? "—" : `${report.dropPercent}%`,
    ].map((data) => ({ data }))),
  ];
  core.summary
    .addHeading(`HonestCI: ${result.status === "passed" ? "passed" : "failed"}`, 2)
    .addRaw("HonestCI verifies observable CI execution evidence. It does not prove test quality or program correctness.\n\n")
    .addTable(rows);
  if (result.findings.length > 0) {
    core.summary.addHeading("Findings", 3).addList(result.findings.map((finding) => `${finding.code}: ${finding.message}`));
  } else {
    core.summary.addRaw("\nNo findings.\n");
  }
  if (evidencePath) {
    core.summary.addHeading("Evidence bundle", 3)
      .addCodeBlock(evidencePath)
      .addRaw("The bundle records hashes and allowlisted provenance. It does not prove runner authenticity, test quality, or program correctness.\n");
  }
  await core.summary.write();
}

async function main(): Promise<void> {
  const workspace = process.env.GITHUB_WORKSPACE ?? process.cwd();
  const configPath = core.getInput("config") || "honest-ci.yml";
  const config = await loadConfig(configPath, workspace);
  const command = core.getInput("command");
  const token = core.getInput("github-token");
  const evidenceOutput = core.getInput("evidence-output");
  const baselineResult = await loadTrustedBaseline(config, workspace, token);
  const lintFindings = await lintWorkflows(config, workspace);
  let snapshots;
  let commandExit = 0;
  if (command.trim()) {
    snapshots = await snapshotReports(config, workspace);
    commandExit = await runShellCommand(command, workspace);
  }
  const initialFindings = [...baselineResult.findings, ...lintFindings];
  if (commandExit !== 0) initialFindings.push(commandFailure(commandExit));
  const result = await checkReports(config, workspace, {
    baseline: baselineResult.baseline,
    ...(snapshots ? { snapshots } : { freshnessUnverified: true }),
    initialFindings,
  });
  const evidencePath = evidenceOutput
    ? await writeEvidenceBundle({
      config,
      configPath,
      result,
      workspace,
      outputPath: evidenceOutput,
      includeWorkflows: true,
      ...(baselineResult.baselineArtifact
        ? { additionalArtifacts: [baselineResult.baselineArtifact] }
        : {}),
    })
    : undefined;

  for (const finding of result.findings) annotate(finding);
  core.setOutput("tests", result.totals.tests);
  core.setOutput("failures", result.totals.failures);
  core.setOutput("errors", result.totals.errors);
  core.setOutput("skipped", result.totals.skipped);
  core.setOutput("baseline-tests", result.baselineTests ?? "");
  core.setOutput("drop-percent", result.dropPercent ?? "");
  core.setOutput("warnings", result.findings.filter((finding) => finding.severity === "warning").length);
  if (evidencePath) core.setOutput("evidence-path", evidencePath);
  await summary(result, evidencePath);
  if (result.status === "failed") core.setFailed("HonestCI found definite CI evidence problems.");
}

main().catch((error: unknown) => {
  core.setFailed(`HonestCI input error: ${error instanceof Error ? error.message : String(error)}`);
});
