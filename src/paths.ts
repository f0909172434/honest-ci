import { lstat, mkdir, realpath } from "node:fs/promises";
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

function requireInsideWorkspace(workspace: string, target: string, label: string): void {
  if (!isInsideWorkspace(workspace, target)) {
    throw new HonestCIInputError(`${label} must stay inside the workspace.`);
  }
}

export async function resolveExistingInsideWorkspace(
  workspace: string,
  value: string,
  label: string,
): Promise<string> {
  const lexicalRoot = path.resolve(workspace);
  const lexicalTarget = path.resolve(lexicalRoot, value);
  requireInsideWorkspace(lexicalRoot, lexicalTarget, label);

  const canonicalRoot = await realpath(lexicalRoot);
  const canonicalTarget = await realpath(lexicalTarget);
  requireInsideWorkspace(canonicalRoot, canonicalTarget, label);
  if ((await lstat(lexicalTarget)).isSymbolicLink()) {
    throw new HonestCIInputError(`${label} must not be a symbolic link.`);
  }
  return canonicalTarget;
}

export async function prepareWritableFileInsideWorkspace(
  workspace: string,
  value: string,
  label: string,
): Promise<string> {
  assertRelativeWorkspacePath(value, label);
  const lexicalRoot = path.resolve(workspace);
  const lexicalTarget = resolveInsideWorkspace(lexicalRoot, value, label);
  const canonicalRoot = await realpath(lexicalRoot);
  const relativeTarget = path.relative(lexicalRoot, lexicalTarget);
  const parentParts = path.dirname(relativeTarget)
    .split(path.sep)
    .filter((part) => part !== "." && part !== "");

  let canonicalParent = canonicalRoot;
  for (const part of parentParts) {
    canonicalParent = path.join(canonicalParent, part);
    try {
      const metadata = await lstat(canonicalParent);
      if (metadata.isSymbolicLink()) {
        throw new HonestCIInputError(`${label} parent must not be a symbolic link.`);
      }
      if (!metadata.isDirectory()) {
        throw new HonestCIInputError(`${label} parent must be a directory.`);
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      await mkdir(canonicalParent);
    }
  }

  canonicalParent = await realpath(canonicalParent);
  requireInsideWorkspace(canonicalRoot, canonicalParent, label);
  const target = path.join(canonicalParent, path.basename(relativeTarget));
  try {
    const metadata = await lstat(target);
    if (metadata.isSymbolicLink()) {
      throw new HonestCIInputError(`${label} must not be a symbolic link.`);
    }
    if (metadata.isDirectory()) {
      throw new HonestCIInputError(`${label} must be a file.`);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  return target;
}
