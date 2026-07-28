import path from "node:path";

import { HonestCIInputError } from "./types.js";

export function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

export function assertRelativeWorkspacePath(value: string, label: string): void {
  if (!value.trim()) {
    throw new HonestCIInputError(`${label} must not be empty.`);
  }
  if (path.isAbsolute(value)) {
    throw new HonestCIInputError(`${label} must be relative to the workspace.`);
  }
  const normalized = value.replaceAll("\\", "/");
  if (normalized.split("/").includes("..")) {
    throw new HonestCIInputError(`${label} must not leave the workspace.`);
  }
}

export function resolveInsideWorkspace(workspace: string, value: string, label: string): string {
  const root = path.resolve(workspace);
  const target = path.resolve(root, value);
  const relative = path.relative(root, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new HonestCIInputError(`${label} must stay inside the workspace.`);
  }
  return target;
}

export function isInsideWorkspace(workspace: string, value: string): boolean {
  const relative = path.relative(path.resolve(workspace), path.resolve(value));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
