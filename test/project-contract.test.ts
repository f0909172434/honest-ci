import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";
import { parse } from "yaml";

const readmes = ["README.md", "README.zh-TW.md", "README.zh-CN.md", "README.ja.md"];
const rcCli = "npm install --save-dev honest-ci@next";
const rcAction = "f0909172434/honest-ci@v1.0.0-rc.1";

describe("public project contract", () => {
  it.each(readmes)("keeps a complete Quick Start and limitations in %s", async (file) => {
    const source = await readFile(file, "utf8");
    expect(source).toContain("honest-ci.yml");
    expect(source).toContain(rcAction);
    expect(source).toContain("HCI106_BASELINE_UNAVAILABLE");
    expect(source).toContain(rcCli);
    expect(source).toContain("evidence-output");
    expect(source).toContain("docs/EVIDENCE_BUNDLES.md");
    expect(source).toContain("JUnit XML");
    expect(source).toContain("GitHub Actions");
  });

  it("declares every required Action input and output", async () => {
    const metadata = parse(await readFile("action.yml", "utf8")) as Record<string, any>;
    expect(metadata.runs).toEqual({ using: "node24", main: "dist/action/index.js" });
    expect(Object.keys(metadata.inputs)).toEqual(expect.arrayContaining([
      "command", "config", "github-token", "evidence-output",
    ]));
    expect(Object.keys(metadata.outputs)).toEqual(expect.arrayContaining([
      "tests", "failures", "errors", "skipped", "baseline-tests", "drop-percent", "warnings",
      "evidence-path",
    ]));
  });

  it("documents every stable finding code", async () => {
    const source = await readFile("src/types.ts", "utf8");
    const docs = await readFile("docs/FINDINGS.md", "utf8");
    const codes = [...source.matchAll(/\| "(HCI\d{3}_[A-Z_]+)"/g)].map((match) => match[1]!);
    expect(codes.length).toBeGreaterThan(0);
    for (const code of codes) expect(docs).toContain(code);
  });

  it("keeps release gates independent from external tester counts", async () => {
    const policy = await readFile("docs/RELEASE_POLICY.md", "utf8");
    expect(policy).toContain("External use is evidence, not permission");
    expect(policy).toContain("No fixed tester count blocks development or release");
  });

  it("provides runnable JUnit recipes for common ecosystems", async () => {
    const recipes = await readFile("docs/RUNNER_RECIPES.md", "utf8");
    for (const runner of ["Vitest", "Jest", "pytest", "Maven"]) expect(recipes).toContain(runner);
  });

  it("keeps the public demo tied to executable evidence and explicit limits", async () => {
    const demo = await readFile("launch/DEMO.md", "utf8");
    expect(demo).toContain("npm run demo:verify");
    expect(demo).toContain("HCI004_ZERO_TESTS");
    expect(demo).toContain("does not prove that any test suite is sufficient");
  });
});
