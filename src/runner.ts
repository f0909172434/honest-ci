import { spawn as nodeSpawn } from "node:child_process";

import crossSpawn from "cross-spawn";

import { HonestCIInputError } from "./types.js";

export async function runArgv(command: string[], cwd: string): Promise<number> {
  if (command.length === 0) throw new HonestCIInputError("A test command is required after --.");
  return await new Promise<number>((resolve) => {
    // cross-spawn resolves Windows command shims without concatenating argv into
    // a cmd.exe command line. Arguments after `--` therefore stay arguments,
    // including shell metacharacters such as `&` and `|`.
    const child = crossSpawn(command[0]!, command.slice(1), {
      cwd,
      env: process.env,
      shell: false,
      stdio: "inherit",
      windowsHide: true,
    });
    child.once("error", () => resolve(127));
    child.once("exit", (code, signal) => resolve(code ?? (signal ? 1 : 0)));
  });
}

export async function runShellCommand(command: string, cwd: string): Promise<number> {
  if (!command.trim()) throw new HonestCIInputError("Action input command must not be blank.");
  const executable = process.platform === "win32" ? process.env.ComSpec ?? "cmd.exe" : "/bin/bash";
  const args = process.platform === "win32"
    ? ["/d", "/s", "/c", command]
    : ["-eo", "pipefail", "-c", command];
  return await new Promise<number>((resolve) => {
    const child = nodeSpawn(executable, args, {
      cwd,
      env: process.env,
      shell: false,
      stdio: "inherit",
      windowsHide: true,
    });
    child.once("error", () => resolve(127));
    child.once("exit", (code, signal) => resolve(code ?? (signal ? 1 : 0)));
  });
}
