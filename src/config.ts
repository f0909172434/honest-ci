import { readFile } from "node:fs/promises";
import path from "node:path";

import { parse } from "yaml";

import { assertRelativeWorkspacePath, isInsideWorkspace, resolveInsideWorkspace } from "./paths.js";
import { HonestCIInputError, type HonestConfig, type ReportConfig } from "./types.js";

function record(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new HonestCIInputError(`${label} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function stringValue(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new HonestCIInputError(`${label} must be a non-empty string.`);
  }
  return value;
}

function stringArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || value.length === 0 || value.some((entry) => typeof entry !== "string" || !entry.trim())) {
    throw new HonestCIInputError(`${label} must be a non-empty list of strings.`);
  }
  return value as string[];
}

function integer(value: unknown, fallback: number, label: string): number {
  const result = value === undefined ? fallback : value;
  if (typeof result !== "number" || !Number.isInteger(result) || result < 0) {
    throw new HonestCIInputError(`${label} must be a non-negative integer.`);
  }
  return result;
}

function percentage(value: unknown, fallback: number | null, label: string): number | null {
  const result = value === undefined ? fallback : value;
  if (result === null) return null;
  if (typeof result !== "number" || !Number.isFinite(result) || result < 0 || result > 100) {
    throw new HonestCIInputError(`${label} must be null or a number from 0 to 100.`);
  }
  return result;
}

function parseReport(value: unknown, index: number): ReportConfig {
  const raw = record(value, `reports[${index}]`);
  const name = stringValue(raw.name, `reports[${index}].name`);
  const paths = stringArray(raw.paths, `reports[${index}].paths`);
  for (const pattern of paths) assertRelativeWorkspacePath(pattern, `Report path ${pattern}`);
  if (raw.format !== "junit") {
    throw new HonestCIInputError(`reports[${index}].format must be junit.`);
  }
  return {
    name,
    paths,
    format: "junit",
    minTests: integer(raw.min_tests, 1, `reports[${index}].min_tests`),
    maxDropPercent: percentage(raw.max_drop_percent, null, `reports[${index}].max_drop_percent`),
    maxSkippedPercent: percentage(raw.max_skipped_percent, null, `reports[${index}].max_skipped_percent`),
  };
}

export async function loadConfig(configPath = "honest-ci.yml", workspace = process.cwd()): Promise<HonestConfig> {
  const absoluteConfig = path.isAbsolute(configPath)
    ? path.resolve(configPath)
    : resolveInsideWorkspace(workspace, configPath, "Config path");
  if (!path.isAbsolute(configPath)) assertRelativeWorkspacePath(configPath, "Config path");
  if (!isInsideWorkspace(workspace, absoluteConfig)) {
    throw new HonestCIInputError("Config path must stay inside the workspace.");
  }

  let source: string;
  try {
    source = await readFile(absoluteConfig, "utf8");
  } catch (error) {
    throw new HonestCIInputError(`Cannot read config ${path.relative(workspace, absoluteConfig) || absoluteConfig}: ${error instanceof Error ? error.message : String(error)}`);
  }

  let rawValue: unknown;
  try {
    rawValue = parse(source);
  } catch (error) {
    throw new HonestCIInputError(`Cannot parse config: ${error instanceof Error ? error.message : String(error)}`);
  }
  const raw = record(rawValue, "Config");
  if (raw.version !== 1) throw new HonestCIInputError("version must be 1.");
  if (!Array.isArray(raw.reports) || raw.reports.length === 0) {
    throw new HonestCIInputError("reports must contain at least one report definition.");
  }
  const reports = raw.reports.map(parseReport);
  const names = new Set<string>();
  for (const report of reports) {
    if (names.has(report.name)) throw new HonestCIInputError(`Duplicate report name: ${report.name}.`);
    names.add(report.name);
  }

  const baselineRaw = raw.baseline === undefined ? {} : record(raw.baseline, "baseline");
  const baselineFile = baselineRaw.file === undefined ? ".honest-ci/baseline.json" : stringValue(baselineRaw.file, "baseline.file");
  assertRelativeWorkspacePath(baselineFile, "baseline.file");
  const baselineSource = baselineRaw.source ?? "default-branch";
  if (baselineSource !== "default-branch") {
    throw new HonestCIInputError("baseline.source must be default-branch.");
  }

  const workflowsRaw = raw.workflows === undefined ? {} : record(raw.workflows, "workflows");
  const workflowPaths = workflowsRaw.paths === undefined
    ? [".github/workflows/*.yml", ".github/workflows/*.yaml"]
    : stringArray(workflowsRaw.paths, "workflows.paths");
  for (const pattern of workflowPaths) assertRelativeWorkspacePath(pattern, `Workflow path ${pattern}`);

  return {
    version: 1,
    reports,
    baseline: { file: baselineFile, source: "default-branch" },
    workflows: { paths: workflowPaths },
  };
}
