import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { loadTrustedBaseline, type GitHubBaselineOptions } from "../src/github-baseline.js";
import type { HonestConfig } from "../src/types.js";

const roots: string[] = [];
afterEach(async () => Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))));

const config: HonestConfig = {
  version: 1,
  reports: [{ name: "unit", paths: ["reports/*.xml"], format: "junit", minTests: 1, maxDropPercent: 10, maxSkippedPercent: null }],
  baseline: { file: ".honest-ci/baseline.json", source: "default-branch" },
  workflows: { paths: [".github/workflows/*.yml"] },
};

function encodedBaseline(tests: number): string {
  return Buffer.from(JSON.stringify({
    version: 1,
    generatedAt: "2026-01-01T00:00:00.000Z",
    reports: { unit: { tests, failures: 0, errors: 0, skipped: 0 } },
  })).toString("base64");
}

describe("trusted pull request baseline", () => {
  it("ignores a baseline modified in the pull request workspace", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "honest-ci-baseline-"));
    roots.push(root);
    await mkdir(path.join(root, ".honest-ci"), { recursive: true });
    await writeFile(path.join(root, ".honest-ci", "baseline.json"), Buffer.from(encodedBaseline(1), "base64"));
    const getContent = vi.fn(async () => ({ data: { type: "file", encoding: "base64", content: encodedBaseline(1000) } }));
    const options: GitHubBaselineOptions = {
      baseSha: "trusted-base-sha",
      owner: "owner",
      repo: "repo",
      getContent,
    };
    const result = await loadTrustedBaseline(config, root, "not-logged", options);
    expect(result.baseline?.reports.unit?.tests).toBe(1000);
    expect(getContent).toHaveBeenCalledWith(expect.objectContaining({ ref: "trusted-base-sha" }));
  });

  it("degrades to minimum checks when a fork run has no token", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "honest-ci-baseline-"));
    roots.push(root);
    const options: GitHubBaselineOptions = {
      baseSha: "trusted-base-sha",
      owner: "owner",
      repo: "repo",
      getContent: vi.fn(),
    };
    const result = await loadTrustedBaseline(config, root, "", options);
    expect(result.baseline).toBeNull();
    expect(result.findings[0]?.code).toBe("HCI106_BASELINE_UNAVAILABLE");
  });
});
