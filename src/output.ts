import type { CheckResult, Finding, TestTotals } from "./types.js";

export type OutputFormat = "pretty" | "json";

export function parseFormat(value: string): OutputFormat {
  if (value !== "pretty" && value !== "json") {
    throw new Error("--format must be pretty or json.");
  }
  return value;
}

function findingLine(finding: Finding): string {
  const location = finding.file ? ` (${finding.file}${finding.line ? `:${finding.line}` : ""})` : "";
  return `${finding.severity === "error" ? "ERROR" : "WARN "} ${finding.code}${location} ${finding.message}`;
}

export function printCheckResult(result: CheckResult, format: OutputFormat): void {
  if (format === "json") {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.log(`HonestCI ${result.status === "passed" ? "PASSED" : "FAILED"}`);
  console.log(`Tests: ${result.totals.tests}  Failures: ${result.totals.failures}  Errors: ${result.totals.errors}  Skipped: ${result.totals.skipped}`);
  if (result.baselineTests !== null) {
    console.log(`Baseline: ${result.baselineTests}  Drop: ${result.dropPercent ?? 0}%`);
  }
  for (const finding of result.findings) console.log(findingLine(finding));
}

export function printLintResult(findings: Finding[], format: OutputFormat): void {
  if (format === "json") {
    console.log(JSON.stringify({ schemaVersion: 1, status: "passed", findings }, null, 2));
    return;
  }
  console.log(`HonestCI lint: ${findings.length} warning(s)`);
  for (const finding of findings) console.log(findingLine(finding));
}

export function emptyTotals(): TestTotals {
  return { tests: 0, failures: 0, errors: 0, skipped: 0 };
}
