import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { createBaseline, parseBaseline } from "../src/baseline.js";
import { loadConfig } from "../src/config.js";

const roots: string[] = [];
afterEach(async () => Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))));

async function writeConfig(source: string): Promise<{ root: string; file: string }> {
  const root = await mkdtemp(path.join(os.tmpdir(), "honest-ci-config-"));
  roots.push(root);
  const file = path.join(root, "honest-ci.yml");
  await writeFile(file, source);
  return { root, file };
}

describe("configuration and baseline", () => {
  it("loads defaults and snake_case public keys", async () => {
    const { root } = await writeConfig(`
version: 1
reports:
  - name: unit
    paths: [reports/*.xml]
    format: junit
    min_tests: 4
    max_drop_percent: 12.5
`);
    const result = await loadConfig("honest-ci.yml", root);
    expect(result.reports[0]).toMatchObject({ minTests: 4, maxDropPercent: 12.5, maxSkippedPercent: null });
    expect(result.workflows.paths).toHaveLength(2);
  });

  it("rejects globs that leave the workspace", async () => {
    const { root } = await writeConfig(`
version: 1
reports:
  - name: unit
    paths: [../secret.xml]
    format: junit
`);
    await expect(loadConfig("honest-ci.yml", root)).rejects.toThrow(/leave the workspace/i);
  });

  it("rejects an absolute config outside the workspace", async () => {
    const first = await writeConfig(`
version: 1
reports:
  - name: unit
    paths: [reports/*.xml]
    format: junit
`);
    const second = await writeConfig(`
version: 1
reports:
  - name: unit
    paths: [reports/*.xml]
    format: junit
`);
    await expect(loadConfig(second.file, first.root)).rejects.toThrow(/inside the workspace/i);
  });

  it("rejects malformed baseline counters", () => {
    expect(() => parseBaseline('{"version":1,"generatedAt":"2026-01-01T00:00:00Z","reports":{"unit":{"tests":-1,"failures":0,"errors":0,"skipped":0}}}')).toThrow(/non-negative/);
  });

  it("creates a stable baseline schema", () => {
    const value = createBaseline([{
      name: "unit",
      files: ["reports/unit.xml"],
      tests: 5,
      failures: 0,
      errors: 0,
      skipped: 1,
      baselineTests: null,
      dropPercent: null,
    }], "2026-01-01T00:00:00.000Z");
    expect(value).toEqual({
      version: 1,
      generatedAt: "2026-01-01T00:00:00.000Z",
      reports: { unit: { tests: 5, failures: 0, errors: 0, skipped: 1 } },
    });
  });
});
