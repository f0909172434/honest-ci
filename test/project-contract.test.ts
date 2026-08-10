import { readdir, readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";
import { parse } from "yaml";

const readmes = ["README.md", "README.zh-TW.md", "README.zh-CN.md", "README.ja.md"];
const stableCli = "npm install --save-dev honest-ci@1.0.1";
const stableAction = "f0909172434/honest-ci@v1.0.1";

describe("public project contract", () => {
  it.each(readmes)("keeps a complete Quick Start and limitations in %s", async (file) => {
    const source = await readFile(file, "utf8");
    expect(source).toContain("honest-ci.yml");
    expect(source).toContain(stableAction);
    expect(source).toContain("HCI106_BASELINE_UNAVAILABLE");
    expect(source).toContain(stableCli);
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

  it("covers every supported public-registry release endpoint", async () => {
    const workflow = await readFile(".github/workflows/registry-smoke.yml", "utf8");
    const smoke = await readFile("scripts/registry-smoke.mjs", "utf8");
    expect(workflow).toContain("workflow_dispatch:");
    expect(workflow).toContain("os: [ubuntu-latest, macos-latest, windows-latest]");
    expect(workflow).toContain("node: [20, 24]");
    expect(workflow).toContain("npm run registry:smoke");
    expect(smoke).toContain("https://registry.npmjs.org/");
    expect(smoke).toContain("rigorgraph-evidence-bundle");
  });

  it("keeps the stable package, runtime, and OIDC release contract aligned", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8"));
    const version = await readFile("src/version.ts", "utf8");
    const release = await readFile(".github/workflows/release.yml", "utf8");
    expect(packageJson.version).toBe("1.0.1");
    expect(version).toContain('VERSION = "1.0.1"');
    expect(release).toContain('      - "v*.*.*"');
    expect(release).toContain("workflow_dispatch:");
    expect(release).toContain("ref: ${{ inputs.release_ref || github.ref_name }}");
    expect(release).toContain('expected_ref="v${package_version}"');
    expect(release).toContain("environment: npm");
    expect(release).toContain("id-token: write");
    expect(release).toContain("npm publish ./release/*.tgz --tag latest");
    expect(release).toContain('if [[ "${RELEASE_REF}" != *-* ]]');
    expect(release).toContain('major_alias="v${release_version%%.*}"');
    expect(release).toContain('git/refs/tags/${major_alias}');
    expect(await readFile("launch/RELEASE_NOTES-1.0.1.md", "utf8")).toContain(
      "Node.js 20 and 24",
    );
  });

  it("publishes one canonical security policy and an explicit threat model", async () => {
    const policy = await readFile("SECURITY.md", "utf8");
    const threatModel = await readFile("docs/THREAT_MODEL.md", "utf8");
    expect(policy).toContain("Private vulnerability reporting");
    expect(policy).toContain("Automated dependency, static-analysis, or contextual security scans");
    expect(threatModel).toContain("Trust boundaries");
    expect(threatModel).toContain("does not sandbox commands");
  });

  it("pins remote workflow Actions and exposes one stable CI gate", async () => {
    const directory = ".github/workflows";
    const files = (await readdir(directory)).filter((file) => file.endsWith(".yml"));
    const remoteUse = /^\s*-?\s*uses:\s+([^./\s][^@\s]+)@([^\s#]+)/gm;
    for (const file of files) {
      const workflow = await readFile(`${directory}/${file}`, "utf8");
      for (const match of workflow.matchAll(remoteUse)) {
        expect(match[2], `${file}: ${match[0]}`).toMatch(/^[0-9a-f]{40}$/);
      }
    }
    const ci = await readFile(`${directory}/ci.yml`, "utf8");
    expect(ci).toContain("ci-gate:");
    expect(ci).toContain("needs: [verify, package]");
  });

  it("pins official Actions in copy-paste documentation", async () => {
    const actionUse = /uses:\s+(actions\/[^@\s]+)@([^\s#]+)/g;
    for (const file of ["README.md", "docs/RUNNER_RECIPES.md"]) {
      const source = await readFile(file, "utf8");
      for (const match of source.matchAll(actionUse)) {
        expect(match[2], `${file}: ${match[0]}`).toMatch(/^[0-9a-f]{40}$/);
      }
    }
  });

  it("uses the canonical public author in package and Action metadata", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8"));
    const action = parse(await readFile("action.yml", "utf8")) as Record<string, any>;
    expect(packageJson.author).toBe("Wang Chih Kai");
    expect(action.author).toBe("Wang Chih Kai");
  });
});
