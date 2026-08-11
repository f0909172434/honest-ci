import { realpath } from "node:fs/promises";
import path from "node:path";

import { parseJUnitFile } from "./junit.js";
import { findReportFiles, signature } from "./report-files.js";
import { toPosixPath } from "./paths.js";
import {
  ZERO_TOTALS,
  addTotals,
  type BaselineFile,
  type CheckResult,
  type Finding,
  type HonestConfig,
  type ReportResult,
  type ReportSnapshots,
  type TestTotals,
} from "./types.js";

export interface CheckOptions {
  baseline: BaselineFile | null;
  snapshots?: ReportSnapshots;
  freshnessUnverified?: boolean;
  ignoreBaseline?: boolean;
  initialFindings?: Finding[];
}

function error(code: Finding["code"], message: string, report?: string, file?: string): Finding {
  const result: Finding = { code, severity: "error", message };
  if (report !== undefined) result.report = report;
  if (file !== undefined) result.file = file;
  return result;
}

function warning(code: Finding["code"], message: string, report?: string, file?: string): Finding {
  const result: Finding = { code, severity: "warning", message };
  if (report !== undefined) result.report = report;
  if (file !== undefined) result.file = file;
  return result;
}

function dropPercent(current: number, baseline: number): number | null {
  if (baseline <= 0) return null;
  return Math.max(0, ((baseline - current) / baseline) * 100);
}

function round(value: number | null): number | null {
  return value === null ? null : Math.round(value * 100) / 100;
}

export async function checkReports(
  config: HonestConfig,
  workspace: string,
  options: CheckOptions,
): Promise<CheckResult> {
  const findings = [...(options.initialFindings ?? [])];
  const reports: ReportResult[] = [];
  const canonicalWorkspace = await realpath(workspace);

  if (!options.ignoreBaseline && options.baseline === null) {
    findings.push(warning(
      "HCI101_BASELINE_MISSING",
      `No trusted baseline is available. Minimum test checks still apply. Run "honest-ci baseline write" after a successful default-branch run.`,
    ));
  }
  if (options.freshnessUnverified) {
    findings.push(warning(
      "HCI107_FRESHNESS_UNVERIFIED",
      "Existing reports are being checked without wrapping the test command, so report freshness cannot be proven.",
    ));
  }

  for (const report of config.reports) {
    const files = await findReportFiles(report, workspace);
    const relativeFiles = files.map((file) => toPosixPath(path.relative(canonicalWorkspace, file)));
    const baselineReport = options.ignoreBaseline ? undefined : options.baseline?.reports[report.name];
    let totals: TestTotals = ZERO_TOTALS;
    let validFiles = 0;

    if (files.length === 0) {
      findings.push(error(
        "HCI001_MISSING_REPORT",
        `Report "${report.name}" matched no files (${report.paths.join(", ")}).`,
        report.name,
      ));
    }

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index]!;
      const relativeFile = relativeFiles[index]!;
      const before = options.snapshots?.get(report.name)?.get(relativeFile);
      if (options.snapshots && before) {
        const after = await signature(file);
        if (before.sha256 === after.sha256 && before.size === after.size && before.mtimeMs === after.mtimeMs) {
          findings.push(error(
            "HCI003_STALE_REPORT",
            `Report file was not created or changed by this run: ${relativeFile}.`,
            report.name,
            relativeFile,
          ));
        }
      }
      try {
        totals = addTotals(totals, await parseJUnitFile(file));
        validFiles += 1;
      } catch (parseError) {
        findings.push(error(
          "HCI002_INVALID_REPORT",
          `Cannot parse ${relativeFile}: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
          report.name,
          relativeFile,
        ));
      }
    }

    if (validFiles > 0) {
      if (totals.tests === 0) {
        findings.push(error("HCI004_ZERO_TESTS", `Report "${report.name}" contains zero tests.`, report.name));
      } else if (totals.tests < report.minTests) {
        findings.push(error(
          "HCI005_BELOW_MINIMUM",
          `Report "${report.name}" has ${totals.tests} tests; minimum is ${report.minTests}.`,
          report.name,
        ));
      }
      if (totals.failures > 0) {
        findings.push(error("HCI006_TEST_FAILURES", `Report "${report.name}" contains ${totals.failures} test failure(s).`, report.name));
      }
      if (totals.errors > 0) {
        findings.push(error("HCI007_TEST_ERRORS", `Report "${report.name}" contains ${totals.errors} test error(s).`, report.name));
      }
      if (report.maxSkippedPercent !== null && totals.tests > 0) {
        const skipped = (totals.skipped / totals.tests) * 100;
        if (skipped > report.maxSkippedPercent + Number.EPSILON) {
          findings.push(error(
            "HCI009_SKIPPED_LIMIT",
            `Report "${report.name}" skipped ${round(skipped)}% of tests; maximum is ${report.maxSkippedPercent}%.`,
            report.name,
          ));
        }
      }
      if (baselineReport && report.maxDropPercent !== null) {
        const drop = dropPercent(totals.tests, baselineReport.tests);
        if (drop !== null && drop > report.maxDropPercent + Number.EPSILON) {
          findings.push(error(
            "HCI008_BASELINE_DROP",
            `Report "${report.name}" dropped ${round(drop)}% from ${baselineReport.tests} to ${totals.tests} tests; maximum is ${report.maxDropPercent}%.`,
            report.name,
          ));
        }
      }
    }

    reports.push({
      name: report.name,
      files: relativeFiles,
      ...totals,
      baselineTests: baselineReport?.tests ?? null,
      dropPercent: round(baselineReport ? dropPercent(totals.tests, baselineReport.tests) : null),
    });
  }

  let totals = ZERO_TOTALS;
  for (const report of reports) totals = addTotals(totals, report);
  const baselineValues = reports.map((report) => report.baselineTests).filter((value): value is number => value !== null);
  const baselineTests = baselineValues.length === reports.length
    ? baselineValues.reduce((sum, value) => sum + value, 0)
    : null;

  return {
    schemaVersion: 1,
    status: findings.some((finding) => finding.severity === "error") ? "failed" : "passed",
    totals,
    baselineTests,
    dropPercent: round(baselineTests === null ? null : dropPercent(totals.tests, baselineTests)),
    reports,
    findings,
  };
}
