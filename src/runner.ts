import { spawn } from "node:child_process";

import { HonestCIInputError } from "./types.js";

function windowsExecutable(executable: string): string {
  if (process.platform !== "win32") return executable;
  return ["npm", "npx", "pnpm", "yarn"].includes(executable.toLowerCase()) ? `${executable}.cmd` : executable;
}

export async function runArgv(command: string[], cwd: string): Promise<number> {
  if (command.length === 0) throw new HonestCIInputError("A test command is required after --.");
  return await new Promise<number>((resolve) => {
    const executable = windowsExecutable(command[0]!);
    const useCommandProcessor = process.platform === "win32" && /\.(?:cmd|bat)$/i.test(executable);
    const child = spawn(
      useCommandProcessor ? process.env.ComSpec ?? "cmd.exe" : executable,
      useCommandProcessor ? ["/d", "/s", "/c", executable, ...command.slice(1)] : command.slice(1),
      {
      cwd,
      env: process.env,
      shell: false,
      stdio: "inherit",
      windowsHide: true,
      },
    );
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
    const child = spawn(executable, args, {
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
