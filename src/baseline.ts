import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { resolveInsideWorkspace } from "./paths.js";
import { HonestCIInputError, type BaselineFile, type BaselineReport, type HonestConfig, type ReportResult } from "./types.js";

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
  const file = resolveInsideWorkspace(workspace, config.baseline.file, "baseline.file");
  try {
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

export async function writeBaseline(config: HonestConfig, workspace: string, baseline: BaselineFile): Promise<string> {
  const file = resolveInsideWorkspace(workspace, config.baseline.file, "baseline.file");
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(baseline, null, 2)}\n`, "utf8");
  return file;
}
