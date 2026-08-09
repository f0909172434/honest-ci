import { randomBytes } from "node:crypto";
import { readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { checkReports } from "./check.js";
import { prepareWritableFileInsideWorkspace, resolveExistingInsideWorkspace } from "./paths.js";
import { snapshotReports } from "./report-files.js";
import { runArgv } from "./runner.js";
import {
  HonestCIInputError,
  type BaselineFile,
  type BaselineReport,
  type CheckResult,
  type Finding,
  type HonestConfig,
  type ReportResult,
} from "./types.js";

function nonNegativeInteger(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new HonestCIInputError(`${label} must be a non-negative integer.`);
  }
  return value;
}

export function parseBaseline(source: string): BaselineFile {
  let value: unknown;
  try {
    value = JSON.parse(source);
  } catch (error) {
    throw new HonestCIInputError(`Cannot parse baseline JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new HonestCIInputError("Baseline must be a JSON object.");
  }
  const raw = value as Record<string, unknown>;
  if (raw.version !== 1) throw new HonestCIInputError("Baseline version must be 1.");
  if (typeof raw.generatedAt !== "string" || !Number.isFinite(Date.parse(raw.generatedAt))) {
    throw new HonestCIInputError("Baseline generatedAt must be an ISO date string.");
  }
  if (typeof raw.reports !== "object" || raw.reports === null || Array.isArray(raw.reports)) {
    throw new HonestCIInputError("Baseline reports must be an object.");
  }
  const reports: Record<string, BaselineReport> = {};
  for (const [name, reportValue] of Object.entries(raw.reports as Record<string, unknown>)) {
    if (typeof reportValue !== "object" || reportValue === null || Array.isArray(reportValue)) {
      throw new HonestCIInputError(`Baseline report ${name} must be an object.`);
    }
    const report = reportValue as Record<string, unknown>;
    reports[name] = {
      tests: nonNegativeInteger(report.tests, `${name}.tests`),
      failures: nonNegativeInteger(report.failures, `${name}.failures`),
      errors: nonNegativeInteger(report.errors, `${name}.errors`),
      skipped: nonNegativeInteger(report.skipped, `${name}.skipped`),
    };
  }
  return { version: 1, generatedAt: raw.generatedAt, reports };
}

export async function loadLocalBaseline(config: HonestConfig, workspace: string): Promise<BaselineFile | null> {
  try {
    const file = await resolveExistingInsideWorkspace(workspace, config.baseline.file, "baseline.file");
    return parseBaseline(await readFile(file, "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export function createBaseline(reports: ReportResult[], generatedAt = new Date().toISOString()): BaselineFile {
  const entries = reports.map((report) => [
    report.name,
    {
      tests: report.tests,
      failures: report.failures,
      errors: report.errors,
      skipped: report.skipped,
    },
  ] as const);
  return { version: 1, generatedAt, reports: Object.fromEntries(entries) };
}

export async function observeBaseline(
  config: HonestConfig,
  workspace: string,
  testCommand: string[] = [],
): Promise<CheckResult> {
  let snapshots;
  const initialFindings: Finding[] = [];
  if (testCommand.length > 0) {
    snapshots = await snapshotReports(config, workspace);
    const exitCode = await runArgv(testCommand, workspace);
    if (exitCode !== 0) {
      initialFindings.push({
        code: "HCI010_COMMAND_FAILED",
        severity: "error",
        message: `The test command exited with code ${exitCode}.`,
      });
    }
  }
  return checkReports(config, workspace, {
    baseline: null,
    ignoreBaseline: true,
    ...(snapshots ? { snapshots } : { freshnessUnverified: true }),
    initialFindings,
  });
}

export async function writeBaseline(config: HonestConfig, workspace: string, baseline: BaselineFile): Promise<string> {
  const file = await prepareWritableFileInsideWorkspace(
    workspace,
    config.baseline.file,
    "baseline.file",
  );
  const temporary = path.join(
    path.dirname(file),
    `.${path.basename(file)}.${randomBytes(8).toString("hex")}.tmp`,
  );
  try {
    await writeFile(temporary, `${JSON.stringify(baseline, null, 2)}\n`, {
      encoding: "utf8",
      flag: "wx",
    });
    await rename(temporary, file);
  } finally {
    await rm(temporary, { force: true });
  }
  return file;
}
