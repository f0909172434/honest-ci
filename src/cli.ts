#!/usr/bin/env node
import path from "node:path";

import { Command, CommanderError } from "commander";

import { createBaseline, loadLocalBaseline, writeBaseline } from "./baseline.js";
import { checkReports } from "./check.js";
import { loadConfig } from "./config.js";
import { lintWorkflows } from "./lint.js";
import { parseFormat, printCheckResult, printLintResult, type OutputFormat } from "./output.js";
import { snapshotReports } from "./report-files.js";
import { runArgv } from "./runner.js";
import { HonestCIInputError, type Finding } from "./types.js";

const VERSION = "0.1.0-beta.1";

interface CommonOptions {
  config: string;
  format: string;
}

function common(command: Command): Command {
  return command
    .option("--config <path>", "configuration file", "honest-ci.yml")
    .option("--format <format>", "pretty or json", "pretty");
}

function formatOf(options: CommonOptions): OutputFormat {
  try {
    return parseFormat(options.format);
  } catch (error) {
    throw new HonestCIInputError(error instanceof Error ? error.message : String(error));
  }
}

function commandFailure(exitCode: number): Finding {
  return {
    code: "HCI010_COMMAND_FAILED",
    severity: "error",
    message: `The test command exited with code ${exitCode}.`,
  };
}

async function main(): Promise<void> {
  const workspace = process.cwd();
  const program = new Command()
    .name("honest-ci")
    .description("Make green CI mean the tests you expected actually ran.")
    .version(VERSION)
    .showHelpAfterError()
    .exitOverride();

  common(program.command("lint").description("statically inspect GitHub Actions workflows"))
    .action(async (options: CommonOptions) => {
      const config = await loadConfig(options.config, workspace);
      printLintResult(await lintWorkflows(config, workspace), formatOf(options));
    });

  common(program.command("check").description("validate existing JUnit reports"))
    .action(async (options: CommonOptions) => {
      const config = await loadConfig(options.config, workspace);
      const result = await checkReports(config, workspace, {
        baseline: await loadLocalBaseline(config, workspace),
        freshnessUnverified: true,
      });
      printCheckResult(result, formatOf(options));
      process.exitCode = result.status === "passed" ? 0 : 1;
    });

  common(program.command("run").description("run a test command and prove its reports are fresh"))
    .argument("<test-command...>", "command and arguments after --")
    .allowUnknownOption(true)
    .action(async (testCommand: string[], options: CommonOptions) => {
      const config = await loadConfig(options.config, workspace);
      const snapshots = await snapshotReports(config, workspace);
      const exitCode = await runArgv(testCommand, workspace);
      const initialFindings = exitCode === 0 ? [] : [commandFailure(exitCode)];
      const result = await checkReports(config, workspace, {
        baseline: await loadLocalBaseline(config, workspace),
        snapshots,
        initialFindings,
      });
      printCheckResult(result, formatOf(options));
      process.exitCode = result.status === "passed" ? 0 : 1;
    });

  const baseline = program.command("baseline").description("manage committed test-count baselines");
  common(baseline.command("write").description("write a baseline from successful reports"))
    .action(async (options: CommonOptions) => {
      const config = await loadConfig(options.config, workspace);
      const format = formatOf(options);
      const result = await checkReports(config, workspace, {
        baseline: null,
        freshnessUnverified: true,
        ignoreBaseline: true,
      });
      if (result.status === "failed") {
        printCheckResult(result, format);
        process.exitCode = 1;
        return;
      }
      const file = await writeBaseline(config, workspace, createBaseline(result.reports));
      if (format === "json") {
        console.log(JSON.stringify({ ...result, baselineWritten: path.relative(workspace, file) }, null, 2));
      } else {
        printCheckResult(result, format);
        console.log(`Baseline written: ${path.relative(workspace, file)}`);
      }
    });

  await program.parseAsync(process.argv);
}

main().catch((error: unknown) => {
  if (error instanceof CommanderError && error.code === "commander.helpDisplayed") return;
  if (error instanceof CommanderError && error.code === "commander.version") return;
  const message = error instanceof Error ? error.message : String(error);
  if (process.argv.includes("json") || process.argv.includes("--format=json")) {
    console.error(JSON.stringify({ schemaVersion: 1, status: "error", error: { code: "HCI200_INPUT_ERROR", message } }, null, 2));
  } else {
    console.error(`HonestCI input error: ${message}`);
  }
  process.exitCode = 2;
});
