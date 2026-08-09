import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { lintWorkflows } from "../src/lint.js";
import type { HonestConfig } from "../src/types.js";

const roots: string[] = [];
afterEach(async () => Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))));

const config: HonestConfig = {
  version: 1,
  reports: [{ name: "unit", paths: ["reports/*.xml"], format: "junit", minTests: 1, maxDropPercent: 10, maxSkippedPercent: null }],
  baseline: { file: ".honest-ci/baseline.json", source: "default-branch" },
  workflows: { paths: [".github/workflows/*.yml"] },
};

describe("lintWorkflows", () => {
  it("warns on four common false-green patterns without hard failures", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "honest-ci-lint-"));
    roots.push(root);
    const directory = path.join(root, ".github", "workflows");
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "ci.yml"), `
name: CI
on: [push]
jobs:
  tests:
    if: \${{ github.event_name == 'push' }}
    continue-on-error: true
    runs-on: ubuntu-latest
    steps:
      - name: unit tests
        if: \${{ matrix.enabled }}
        continue-on-error: true
        run: npm test -- --passWithNoTests || true
      - name: force green
        run: do-something; exit 0
`);
    const findings = await lintWorkflows(config, root);
    const codes = findings.map((finding) => finding.code);
    expect(codes).toEqual(expect.arrayContaining([
      "HCI102_CONTINUE_ON_ERROR",
      "HCI103_SWALLOWED_EXIT_CODE",
      "HCI104_PASS_WITH_NO_TESTS",
      "HCI105_DYNAMIC_CONDITION",
    ]));
    expect(findings.every((finding) => finding.severity === "warning")).toBe(true);
  });

  it("does not warn on a straightforward healthy workflow", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "honest-ci-lint-"));
    roots.push(root);
    const directory = path.join(root, ".github", "workflows");
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "ci.yml"), `
name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
`);
    expect(await lintWorkflows(config, root)).toEqual([]);
  });

  it("rejects workflow files reached through an external directory link", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "honest-ci-lint-root-"));
    const outside = await mkdtemp(path.join(os.tmpdir(), "honest-ci-lint-outside-"));
    roots.push(root, outside);
    await writeFile(path.join(outside, "ci.yml"), "name: Outside\n");
    await symlink(outside, path.join(root, "linked"), process.platform === "win32" ? "junction" : "dir");
    const linkedConfig: HonestConfig = {
      ...config,
      workflows: { paths: ["linked/*.yml"] },
    };

    await expect(lintWorkflows(linkedConfig, root)).rejects.toThrow(/inside the workspace/i);
  });
});
