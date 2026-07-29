import { randomBytes } from "node:crypto";
import { lstat, mkdir, realpath, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { findWorkflowFiles } from "./lint.js";
import { assertRelativeWorkspacePath, isInsideWorkspace, resolveInsideWorkspace, toPosixPath } from "./paths.js";
import { signature } from "./report-files.js";
import {
  HonestCIInputError,
  type CheckResult,
  type EvidenceArtifact,
  type EvidenceBundle,
  type EvidenceProvenance,
  type HonestConfig,
} from "./types.js";
import { VERSION } from "./version.js";

export interface EvidenceOptions {
  config: HonestConfig;
  configPath: string;
  result: CheckResult;
  workspace: string;
  outputPath: string;
  includeWorkflows?: boolean;
  additionalArtifacts?: EvidenceArtifact[];
  createdAt?: string;
  environment?: NodeJS.ProcessEnv;
}

function provenance(environment: NodeJS.ProcessEnv): EvidenceProvenance | undefined {
  const result: EvidenceProvenance = {};
  const values: Array<[keyof EvidenceProvenance, string | undefined]> = [
    ["repository", environment.GITHUB_REPOSITORY],
    ["ref", environment.GITHUB_REF],
    ["workflow_ref", environment.GITHUB_WORKFLOW_REF],
    ["run_id", environment.GITHUB_RUN_ID],
    ["event", environment.GITHUB_EVENT_NAME],
  ];
  for (const [key, value] of values) {
    if (value?.trim()) Object.assign(result, { [key]: value });
  }
  if (environment.GITHUB_SHA && /^[a-fA-F0-9]{40,64}$/.test(environment.GITHUB_SHA)) {
    result.commit = environment.GITHUB_SHA;
  }
  const attempt = Number(environment.GITHUB_RUN_ATTEMPT);
  if (Number.isInteger(attempt) && attempt >= 1) result.run_attempt = attempt;
  return Object.keys(result).length ? result : undefined;
}

async function artifact(
  workspace: string,
  file: string,
  role: EvidenceArtifact["role"],
): Promise<EvidenceArtifact> {
  const canonicalWorkspace = await realpath(workspace);
  const canonicalFile = await realpath(file);
  if (!isInsideWorkspace(canonicalWorkspace, canonicalFile)) {
    throw new HonestCIInputError(`Evidence artifact leaves the workspace: ${file}.`);
  }
  const details = await signature(canonicalFile);
  return {
    role,
    path: toPosixPath(path.relative(canonicalWorkspace, canonicalFile)),
    size: details.size,
    sha256: details.sha256,
  };
}

async function optionalArtifact(
  workspace: string,
  file: string,
  role: EvidenceArtifact["role"],
): Promise<EvidenceArtifact | null> {
  try {
    return await artifact(workspace, file, role);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

async function collectArtifacts(options: EvidenceOptions): Promise<EvidenceArtifact[]> {
  const configFile = path.isAbsolute(options.configPath)
    ? path.resolve(options.configPath)
    : resolveInsideWorkspace(options.workspace, options.configPath, "Config path");
  const artifacts: EvidenceArtifact[] = [await artifact(options.workspace, configFile, "config")];
  for (const report of options.result.reports) {
    for (const relative of report.files) {
      artifacts.push(
        await artifact(
          options.workspace,
          resolveInsideWorkspace(options.workspace, relative, "Report path"),
          "report",
        ),
      );
    }
  }
  const baseline = await optionalArtifact(
    options.workspace,
    resolveInsideWorkspace(options.workspace, options.config.baseline.file, "baseline.file"),
    "baseline",
  );
  if (baseline) artifacts.push(baseline);
  if (options.includeWorkflows) {
    for (const file of await findWorkflowFiles(options.config, options.workspace)) {
      artifacts.push(await artifact(options.workspace, file, "workflow"));
    }
  }
  artifacts.push(...(options.additionalArtifacts ?? []));
  const unique = new Map<string, EvidenceArtifact>();
  for (const item of artifacts) unique.set(item.path, item);
  return [...unique.values()].sort((left, right) => left.path.localeCompare(right.path));
}

async function writeInsideWorkspace(workspace: string, outputPath: string, content: string): Promise<string> {
  assertRelativeWorkspacePath(outputPath, "Evidence output path");
  const output = resolveInsideWorkspace(workspace, outputPath, "Evidence output path");
  const parent = path.dirname(output);
  await mkdir(parent, { recursive: true });
  const canonicalWorkspace = await realpath(workspace);
  const canonicalParent = await realpath(parent);
  if (!isInsideWorkspace(canonicalWorkspace, canonicalParent)) {
    throw new HonestCIInputError("Evidence output path must stay inside the workspace.");
  }
  try {
    if ((await lstat(output)).isSymbolicLink()) {
      throw new HonestCIInputError("Evidence output file must not be a symbolic link.");
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const temporary = path.join(parent, `.${path.basename(output)}.${randomBytes(8).toString("hex")}.tmp`);
  try {
    await writeFile(temporary, content, { encoding: "utf8", flag: "wx" });
    await rename(temporary, output);
  } finally {
    await rm(temporary, { force: true });
  }
  return toPosixPath(path.relative(path.resolve(workspace), output));
}

export async function writeEvidenceBundle(options: EvidenceOptions): Promise<string> {
  const source = provenance(options.environment ?? process.env);
  const bundle: EvidenceBundle = {
    format: "rigorgraph-evidence-bundle",
    schema_version: 1,
    profile: "honest-ci/check-result-v1",
    evidence_type: "computation",
    title: "HonestCI test execution evidence",
    scope: "Observed CI test execution, report integrity, and configured thresholds only.",
    created_at: options.createdAt ?? new Date().toISOString(),
    producer: { name: "honest-ci", version: VERSION },
    ...(source ? { provenance: source } : {}),
    artifacts: await collectArtifacts(options),
    result: options.result,
  };
  return writeInsideWorkspace(
    options.workspace,
    options.outputPath,
    `${JSON.stringify(bundle, null, 2)}\n`,
  );
}
