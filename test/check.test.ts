import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { checkReports } from "../src/check.js";
import { snapshotReports } from "../src/report-files.js";
import type { BaselineFile, HonestConfig } from "../src/types.js";

const roots: string[] = [];

afterEach(async () => {
  const { rm } = await import("node:fs/promises");
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function workspace(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "honest-ci-測試 space-"));
  roots.push(root);
  await mkdir(path.join(root, "reports"), { recursive: true });
  return root;
}

function config(overrides: Partial<HonestConfig["reports"][number]> = {}): HonestConfig {
  return {
    version: 1,
    reports: [{
      name: "unit",
      paths: ["reports/*.xml"],
      format: "junit",
      minTests: 1,
      maxDropPercent: 10,
      maxSkippedPercent: null,
      ...overrides,
    }],
    baseline: { file: ".honest-ci/baseline.json", source: "default-branch" },
    workflows: { paths: [".github/workflows/*.yml"] },
  };
}

function baseline(tests: number): BaselineFile {
  return {
    version: 1,
    generatedAt: "2026-01-01T00:00:00.000Z",
    reports: { unit: { tests, failures: 0, errors: 0, skipped: 0 } },
  };
}

describe("checkReports", () => {
  it("fails when a required report is missing", async () => {
    const root = await workspace();
    const result = await checkReports(config(), root, { baseline: null });
    expect(result.status).toBe("failed");
    expect(result.findings.map((finding) => finding.code)).toContain("HCI001_MISSING_REPORT");
  });

  it("fails on zero tests, failures, errors, and an exceeded skipped limit", async () => {
    const root = await workspace();
    await writeFile(path.join(root, "reports", "junit.xml"), '<testsuite tests="0" failures="2" errors="1" skipped="1"/>');
    const result = await checkReports(config({ maxSkippedPercent: 5 }), root, { baseline: null });
    expect(result.status).toBe("failed");
    expect(result.findings.map((finding) => finding.code)).toEqual(expect.arrayContaining([
      "HCI004_ZERO_TESTS",
      "HCI006_TEST_FAILURES",
      "HCI007_TEST_ERRORS",
    ]));
  });

  it("treats 1000 to 900 as within a 10 percent threshold", async () => {
    const root = await workspace();
    await writeFile(path.join(root, "reports", "junit.xml"), '<testsuite tests="900"/>');
    const result = await checkReports(config(), root, { baseline: baseline(1000) });
    expect(result.status).toBe("passed");
    expect(result.dropPercent).toBe(10);
  });

  it("fails 1000 to 899 at a 10 percent threshold", async () => {
    const root = await workspace();
    await writeFile(path.join(root, "reports", "junit.xml"), '<testsuite tests="899"/>');
    const result = await checkReports(config(), root, { baseline: baseline(1000) });
    expect(result.status).toBe("failed");
    expect(result.findings.map((finding) => finding.code)).toContain("HCI008_BASELINE_DROP");
  });

  it("deduplicates report files matched by overlapping globs", async () => {
    const root = await workspace();
    await writeFile(path.join(root, "reports", "junit.xml"), '<testsuite tests="7"/>');
    const result = await checkReports(config({ paths: ["reports/*.xml", "reports/junit.xml"] }), root, { baseline: null });
    expect(result.totals.tests).toBe(7);
  });

  it("fails when a wrapped run leaves an existing report unchanged", async () => {
    const root = await workspace();
    const report = path.join(root, "reports", "junit.xml");
    await writeFile(report, '<testsuite tests="3"/>');
    const snapshots = await snapshotReports(config(), root);
    const result = await checkReports(config(), root, { baseline: null, snapshots });
    expect(result.findings.map((finding) => finding.code)).toContain("HCI003_STALE_REPORT");
  });

  it("accepts a report changed by the wrapped run", async () => {
    const root = await workspace();
    const report = path.join(root, "reports", "junit.xml");
    await writeFile(report, '<testsuite tests="3"/>');
    const snapshots = await snapshotReports(config(), root);
    await writeFile(report, '<testsuite tests="4"/>');
    const result = await checkReports(config(), root, { baseline: null, snapshots });
    expect(result.findings.map((finding) => finding.code)).not.toContain("HCI003_STALE_REPORT");
  });

  it("accepts an identical report that the wrapped run rewrote", async () => {
    const root = await workspace();
    const report = path.join(root, "reports", "junit.xml");
    const xml = '<testsuite tests="3"/>';
    await writeFile(report, xml);
    const snapshots = await snapshotReports(config(), root);
    await new Promise((resolve) => setTimeout(resolve, 15));
    await writeFile(report, xml);
    const result = await checkReports(config(), root, { baseline: null, snapshots });
    expect(result.findings.map((finding) => finding.code)).not.toContain("HCI003_STALE_REPORT");
  });

  it("rejects an XML external entity fixture", async () => {
    const root = await workspace();
    await writeFile(path.join(root, "reports", "junit.xml"), '<!DOCTYPE x [<!ENTITY e SYSTEM "file:///secret">]><testsuite tests="1"/>');
    const result = await checkReports(config(), root, { baseline: null });
    expect(result.findings.map((finding) => finding.code)).toContain("HCI002_INVALID_REPORT");
  });

  it("warns rather than fails when standalone check cannot prove freshness", async () => {
    const root = await workspace();
    await writeFile(path.join(root, "reports", "junit.xml"), '<testsuite tests="1"/>');
    const result = await checkReports(config(), root, { baseline: null, freshnessUnverified: true });
    expect(result.status).toBe("passed");
    expect(result.findings.map((finding) => finding.code)).toContain("HCI107_FRESHNESS_UNVERIFIED");
  });
});
