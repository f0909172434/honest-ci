import { createHash } from "node:crypto";
import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";

import fg from "fast-glob";

import { isInsideWorkspace, toPosixPath } from "./paths.js";
import { HonestCIInputError, type FileSignature, type HonestConfig, type ReportConfig, type ReportSnapshots } from "./types.js";

export async function findReportFiles(report: ReportConfig, workspace: string): Promise<string[]> {
  const canonicalWorkspace = await realpath(workspace);
  const matches = await fg(report.paths, {
    absolute: true,
    cwd: workspace,
    dot: true,
    followSymbolicLinks: false,
    onlyFiles: true,
    unique: true,
  });
  const files = new Map<string, string>();
  for (const match of matches) {
    const canonical = await realpath(match);
    if (!isInsideWorkspace(canonicalWorkspace, canonical)) {
      throw new HonestCIInputError(`Report file leaves the workspace: ${match}.`);
    }
    files.set(process.platform === "win32" ? canonical.toLowerCase() : canonical, path.resolve(match));
  }
  return [...files.values()].sort((left, right) => left.localeCompare(right));
}

export async function signature(file: string): Promise<FileSignature> {
  const content = await readFile(file);
  const metadata = await stat(file);
  return {
    sha256: createHash("sha256").update(content).digest("hex"),
    size: content.length,
    mtimeMs: metadata.mtimeMs,
  };
}

export async function snapshotReports(config: HonestConfig, workspace: string): Promise<ReportSnapshots> {
  const snapshots: ReportSnapshots = new Map();
  for (const report of config.reports) {
    const files = await findReportFiles(report, workspace);
    const reportSnapshot = new Map<string, FileSignature>();
    for (const file of files) reportSnapshot.set(toPosixPath(path.relative(workspace, file)), await signature(file));
    snapshots.set(report.name, reportSnapshot);
  }
  return snapshots;
}
