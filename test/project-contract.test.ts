import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";
import { parse } from "yaml";

const readmes = ["README.md", "README.zh-TW.md", "README.zh-CN.md", "README.ja.md"];

describe("public project contract", () => {
  it.each(readmes)("keeps a complete Quick Start and limitations in %s", async (file) => {
    const source = await readFile(file, "utf8");
    expect(source).toContain("honest-ci.yml");
    expect(source).toContain("f0909172434/honest-ci@v0.1.0-beta.1");
    expect(source).toContain("HCI106_BASELINE_UNAVAILABLE");
    expect(source).toContain("npm install --save-dev honest-ci");
    expect(source).toContain("JUnit XML");
    expect(source).toContain("GitHub Actions");
  });

  it("declares every required Action input and output", async () => {
    const metadata = parse(await readFile("action.yml", "utf8")) as Record<string, any>;
    expect(metadata.runs).toEqual({ using: "node24", main: "dist/action/index.js" });
    expect(Object.keys(metadata.inputs)).toEqual(expect.arrayContaining(["command", "config", "github-token"]));
    expect(Object.keys(metadata.outputs)).toEqual(expect.arrayContaining([
      "tests", "failures", "errors", "skipped", "baseline-tests", "drop-percent", "warnings",
    ]));
  });

  it("documents every stable finding code", async () => {
    const source = await readFile("src/types.ts", "utf8");
    const docs = await readFile("docs/FINDINGS.md", "utf8");
    const codes = [...source.matchAll(/\| "(HCI\d{3}_[A-Z_]+)"/g)].map((match) => match[1]!);
    expect(codes.length).toBeGreaterThan(0);
    for (const code of codes) expect(docs).toContain(code);
  });

  it("keeps beta release gates independent from external tester counts", async () => {
    const policy = await readFile("docs/BETA_POLICY.md", "utf8");
    const checklist = await readFile("launch/RELEASE_CHECKLIST.md", "utf8");
    expect(policy).toContain("External use is evidence, not permission");
    expect(checklist).toContain("External testing is a post-release evidence target, not a beta blocker");
  });

  it("provides runnable JUnit recipes for common ecosystems", async () => {
    const recipes = await readFile("docs/RUNNER_RECIPES.md", "utf8");
    for (const runner of ["Vitest", "Jest", "pytest", "Maven"]) expect(recipes).toContain(runner);
  });
});
