import { access, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { runArgv } from "../src/runner.js";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("runArgv", () => {
  it("keeps Windows shell metacharacters inside one argv element", async () => {
    if (process.platform !== "win32") return;

    const root = await mkdtemp(path.join(os.tmpdir(), "honest-ci-runner-"));
    roots.push(root);
    await writeFile(
      path.join(root, "marker.cmd"),
      "@echo off\r\n> marker.txt echo command processor was injected\r\n",
      "utf8",
    );

    const exitCode = await runArgv(["npm", "--version", "&marker.cmd"], root);

    expect(exitCode).toBe(0);
    await expect(access(path.join(root, "marker.txt"))).rejects.toMatchObject({ code: "ENOENT" });
  });
});
