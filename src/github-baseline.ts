import { readFile } from "node:fs/promises";

import * as github from "@actions/github";

import { loadLocalBaseline, parseBaseline } from "./baseline.js";
import { type BaselineFile, type Finding, type HonestConfig } from "./types.js";

export interface TrustedBaselineResult {
  baseline: BaselineFile | null;
  findings: Finding[];
}

export interface GitHubBaselineOptions {
  baseSha: string | null;
  owner: string;
  repo: string;
  getContent: (request: { owner: string; repo: string; path: string; ref: string }) => Promise<{
    data: { type: string; content?: string; encoding?: string } | unknown[];
  }>;
}

function unavailable(message: string): TrustedBaselineResult {
  return {
    baseline: null,
    findings: [{ code: "HCI106_BASELINE_UNAVAILABLE", severity: "warning", message }],
  };
}

function pullRequestBaseSha(): string | null {
  const pullRequest = github.context.payload.pull_request as { base?: { sha?: unknown } } | undefined;
  return typeof pullRequest?.base?.sha === "string" ? pullRequest.base.sha : null;
}

export async function loadTrustedBaseline(
  config: HonestConfig,
  workspace: string,
  token: string,
  options?: GitHubBaselineOptions,
): Promise<TrustedBaselineResult> {
  const baseSha = options ? options.baseSha : pullRequestBaseSha();
  if (!baseSha) return { baseline: await loadLocalBaseline(config, workspace), findings: [] };
  if (!token) {
    return unavailable("No GitHub token is available to read the pull request base baseline. Minimum test checks still apply.");
  }

  try {
    const context = options ?? {
      baseSha,
      ...github.context.repo,
      getContent: github.getOctokit(token).rest.repos.getContent,
    };
    const response = await context.getContent({ owner: context.owner, repo: context.repo, path: config.baseline.file, ref: baseSha });
    const data = response.data;
    if (Array.isArray(data) || data.type !== "file" || !("content" in data) || typeof data.content !== "string") {
      return unavailable("The trusted baseline path on the pull request base commit is not a readable file.");
    }
    return {
      baseline: parseBaseline(Buffer.from(data.content, data.encoding === "base64" ? "base64" : "utf8").toString("utf8")),
      findings: [],
    };
  } catch (error) {
    const status = typeof error === "object" && error !== null && "status" in error ? (error as { status?: unknown }).status : undefined;
    if (status === 404) return { baseline: null, findings: [] };
    return unavailable("The trusted baseline could not be read from the pull request base commit. Minimum test checks still apply.");
  }
}

export async function loadBaselineFromFile(file: string): Promise<BaselineFile> {
  return parseBaseline(await readFile(file, "utf8"));
}
