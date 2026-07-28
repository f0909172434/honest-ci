import { readFile } from "node:fs/promises";
import path from "node:path";

import fg from "fast-glob";
import { parse } from "yaml";

import { isInsideWorkspace, toPosixPath } from "./paths.js";
import { HonestCIInputError, type Finding, type HonestConfig } from "./types.js";

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function warning(code: Finding["code"], message: string, file: string): Finding {
  return { code, severity: "warning", message, file };
}

function testLike(jobName: string, step: Record<string, unknown>): boolean {
  const haystack = [jobName, step.name, step.run].filter((value): value is string => typeof value === "string").join(" ");
  return /\b(test|tests|jest|vitest|pytest|junit|mocha|rspec|spec)\b/i.test(haystack);
}

function inspectWorkflow(value: unknown, file: string): Finding[] {
  const root = asRecord(value);
  const jobs = asRecord(root?.jobs);
  if (!jobs) return [];
  const findings: Finding[] = [];
  for (const [jobName, jobValue] of Object.entries(jobs)) {
    const job = asRecord(jobValue);
    if (!job) continue;
    if (job["continue-on-error"] === true) {
      findings.push(warning("HCI102_CONTINUE_ON_ERROR", `Job "${jobName}" uses continue-on-error: true.`, file));
    }
    if (typeof job.if === "string" && /\$\{\{|github\.|needs\.|matrix\./i.test(job.if) && /test/i.test(jobName)) {
      findings.push(warning("HCI105_DYNAMIC_CONDITION", `Test-like job "${jobName}" has a dynamic condition that may skip it.`, file));
    }
    const steps = Array.isArray(job.steps) ? job.steps : [];
    for (const [index, stepValue] of steps.entries()) {
      const step = asRecord(stepValue);
      if (!step) continue;
      const label = typeof step.name === "string" ? step.name : `step ${index + 1}`;
      if (step["continue-on-error"] === true) {
        findings.push(warning("HCI102_CONTINUE_ON_ERROR", `Step "${label}" in job "${jobName}" uses continue-on-error: true.`, file));
      }
      const run = typeof step.run === "string" ? step.run : "";
      if (/\|\|\s*true\b|(?:^|[;&|\n])\s*exit\s+0\b/im.test(run)) {
        findings.push(warning("HCI103_SWALLOWED_EXIT_CODE", `Step "${label}" in job "${jobName}" may force a successful exit code.`, file));
      }
      if (/--passWithNoTests\b/i.test(run)) {
        findings.push(warning("HCI104_PASS_WITH_NO_TESTS", `Step "${label}" in job "${jobName}" allows an empty test run.`, file));
      }
      if (typeof step.if === "string" && /\$\{\{|github\.|needs\.|matrix\./i.test(step.if) && testLike(jobName, step)) {
        findings.push(warning("HCI105_DYNAMIC_CONDITION", `Test-like step "${label}" in job "${jobName}" has a dynamic condition that may skip it.`, file));
      }
    }
  }
  return findings;
}

export async function lintWorkflows(config: HonestConfig, workspace: string): Promise<Finding[]> {
  const files = await fg(config.workflows.paths, {
    absolute: true,
    cwd: workspace,
    dot: true,
    followSymbolicLinks: false,
    onlyFiles: true,
    unique: true,
  });
  const findings: Finding[] = [];
  for (const file of files.sort()) {
    if (!isInsideWorkspace(workspace, file)) throw new HonestCIInputError(`Workflow leaves the workspace: ${file}.`);
    const relative = toPosixPath(path.relative(workspace, file));
    let value: unknown;
    try {
      value = parse(await readFile(file, "utf8"));
    } catch (error) {
      throw new HonestCIInputError(`Cannot parse workflow ${relative}: ${error instanceof Error ? error.message : String(error)}`);
    }
    findings.push(...inspectWorkflow(value, relative));
  }
  return findings.sort((left, right) => `${left.file}:${left.code}:${left.message}`.localeCompare(`${right.file}:${right.code}:${right.message}`));
}
