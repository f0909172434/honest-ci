import { spawnSync } from "node:child_process";

import { describe, expect, it } from "vitest";

function check(tag: string) {
  return spawnSync(process.execPath, ["scripts/check-release-version.mjs", tag], {
    encoding: "utf8",
    env: { ...process.env, GITHUB_REF_NAME: "main" },
    shell: false,
    windowsHide: true,
  });
}

describe("release version check", () => {
  it("prefers an explicit recovery tag over the workflow dispatch ref", () => {
    const result = check("v1.0.4");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Release version matches: v1.0.4");
  });

  it("rejects a mismatched explicit recovery tag", () => {
    const result = check("v1.0.1");
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("does not match package version 1.0.4");
  });
});
