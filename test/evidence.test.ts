import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { writeEvidenceBundle } from "../src/evidence.js";
import { HonestCIInputError, type CheckResult, type HonestConfig } from "../src/types.js";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

function config(): HonestConfig {
  return {
    version: 1,
    reports: [{
      name: "unit",
      paths: ["reports/junit.xml"],
      format: "junit",
      minTests: 1,
      maxDropPercent: 10,
      maxSkippedPercent: null,
    }],
    baseline: { file: ".honest-ci/baseline.json", source: "default-branch" },
    workflows: { paths: [".github/workflows/*.yml"] },
  };
}

function result(status: "passed" | "failed" = "passed"): CheckResult {
  return {
    schemaVersion: 1,
    status,
    totals: { tests: status === "passed" ? 1 : 0, failures: 0, errors: 0, skipped: 0 },
    baselineTests: 1,
    dropPercent: status === "passed" ? 0 : 100,
    reports: [{
      name: "unit",
      files: ["reports/junit.xml"],
      tests: status === "passed" ? 1 : 0,
      failures: 0,
      errors: 0,
      skipped: 0,
      baselineTests: 1,
      dropPercent: status === "passed" ? 0 : 100,
    }],
    findings: status === "passed" ? [] : [{
      code: "HCI004_ZERO_TESTS",
      severity: "error",
      message: "The report contains zero tests.",
      report: "unit",
    }],
  };
}

async function workspace(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "honest-ci-evidence-"));
  roots.push(root);
  await mkdir(path.join(root, "reports"), { recursive: true });
  await mkdir(path.join(root, ".honest-ci"), { recursive: true });
  await mkdir(path.join(root, ".github", "workflows"), { recursive: true });
  await writeFile(path.join(root, "honest-ci.yml"), "version: 1\nreports: []\n", "utf8");
  await writeFile(path.join(root, "reports", "junit.xml"), '<testsuite tests="1"/>\n', "utf8");
  await writeFile(path.join(root, ".honest-ci", "baseline.json"), '{"version":1}\n', "utf8");
  await writeFile(path.join(root, ".github", "workflows", "ci.yml"), "name: CI\n", "utf8");
  return root;
}

describe("RigorGraph Evidence Bundle v1", () => {
  it("writes hashes, failed results, and only allowlisted GitHub provenance", async () => {
    const root = await workspace();
    const output = await writeEvidenceBundle({
      config: config(),
      configPath: "honest-ci.yml",
      result: result("failed"),
      workspace: root,
      outputPath: ".honest-ci/evidence.json",
      includeWorkflows: true,
      createdAt: "2026-07-29T00:00:00.000Z",
      environment: {
        GITHUB_REPOSITORY: "owner/repo",
        GITHUB_SHA: "a".repeat(40),
        GITHUB_REF: "refs/heads/main",
        GITHUB_WORKFLOW_REF: "owner/repo/.github/workflows/ci.yml@refs/heads/main",
        GITHUB_RUN_ID: "42",
        GITHUB_RUN_ATTEMPT: "2",
        GITHUB_EVENT_NAME: "push",
        SECRET_SENTINEL: "must-not-appear",
      },
    });
    expect(output).toBe(".honest-ci/evidence.json");
    const raw = await readFile(path.join(root, output), "utf8");
    const bundle = JSON.parse(raw);
    expect(bundle).toMatchObject({
      format: "rigorgraph-evidence-bundle",
      schema_version: 1,
      profile: "honest-ci/check-result-v1",
      evidence_type: "computation",
      producer: { name: "honest-ci", version: "1.0.0" },
      result: { status: "failed" },
      provenance: { repository: "owner/repo", commit: "a".repeat(40), run_attempt: 2 },
    });
    expect(raw).not.toContain("must-not-appear");
    expect(raw).not.toContain("<testsuite");
    const report = bundle.artifacts.find((entry: { role: string }) => entry.role === "report");
    const reportBytes = await readFile(path.join(root, "reports", "junit.xml"));
    expect(report.sha256).toBe(createHash("sha256").update(reportBytes).digest("hex"));
    expect(new Set(bundle.artifacts.map((entry: { path: string }) => entry.path)).size)
      .toBe(bundle.artifacts.length);
  });

  it("rejects traversal and a symlinked output parent", async () => {
    const root = await workspace();
    await expect(writeEvidenceBundle({
      config: config(),
      configPath: "honest-ci.yml",
      result: result(),
      workspace: root,
      outputPath: "../evidence.json",
    })).rejects.toBeInstanceOf(HonestCIInputError);

    const outside = await mkdtemp(path.join(os.tmpdir(), "honest-ci-outside-"));
    roots.push(outside);
    await symlink(outside, path.join(root, "linked"), process.platform === "win32" ? "junction" : "dir");
    await expect(writeEvidenceBundle({
      config: config(),
      configPath: "honest-ci.yml",
      result: result(),
      workspace: root,
      outputPath: "linked/evidence.json",
    })).rejects.toBeInstanceOf(HonestCIInputError);
    await expect(readFile(path.join(outside, "evidence.json"))).rejects.toMatchObject({ code: "ENOENT" });
  });
});
