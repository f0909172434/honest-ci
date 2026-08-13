# Technical overview

HonestCI 1.x is a local Node.js program distributed as both an npm CLI and a
GitHub JavaScript Action. Both entry points load the same configuration, JUnit
parser, report evaluator, baseline model, finding codes, and evidence writer.
There is no hosted control plane and no AI or telemetry call in the evaluation
path.

## Execution paths

| Entry point | Command execution | Baseline source | Workflow lint | Evidence artifacts |
| --- | --- | --- | --- | --- |
| `honest-ci run` | Argument vector after `--`, launched without a shell | Workspace file | Not automatic; call `lint` separately | Config, reports, and local baseline when present |
| `honest-ci check` | None | Workspace file | Not automatic | Config, reports, and local baseline when present |
| `honest-ci baseline write` | Optional argument vector, launched without a shell | Ignored while observing the new baseline | No | Does not emit a bundle |
| GitHub Action with `command` | Shell string: Bash with `-eo pipefail` on Unix, `cmd.exe /d /s /c` on Windows | Pull-request base commit through the GitHub API; workspace file otherwise | Automatic | Config, reports, trusted baseline, and inspected workflows |
| GitHub Action without `command` | None | Same Action baseline rules | Automatic | Same Action artifacts; result includes `HCI107_FRESHNESS_UNVERIFIED` |

The CLI's argument-vector execution avoids reinterpreting metacharacters through
a shell. The Action accepts a shell string to match normal workflow authoring.
The Action command is trusted operator input and must not be assembled from
pull-request-controlled values. Neither path is a sandbox.

## Evaluation pipeline

```text
1. Parse honest-ci.yml and validate workspace-relative paths
2. Select a local or pull-request-base baseline
3. Inspect configured workflow YAML (Action) and snapshot reports (wrapped mode)
4. Execute the test command, when supplied
5. Discover report files, resolve real paths, and deduplicate matches
6. Validate and parse JUnit XML; aggregate files by named report
7. Apply fixed checks, configured thresholds, and baseline comparisons
8. Produce CheckResult v1 and stable finding codes
9. Optionally write Evidence Bundle v1
10. Render CLI output or Action annotations, outputs, and Job Summary
```

An error-severity finding makes `CheckResult.status` equal `failed`; warnings do
not. The Action calls `setFailed` for a failed result. The CLI maps passed,
failed, and unevaluable input to exit statuses 0, 1, and 2 respectively.

## Freshness and report discovery

Before a wrapped command starts, HonestCI records SHA-256, byte size, and
modification time for every report file that already matches the configured
globs. After the command finishes, it discovers the files again. A pre-existing
file whose three recorded values are unchanged receives
`HCI003_STALE_REPORT`; a newly discovered file has no prior snapshot and is
treated as produced by the run.

Freshness links an observed file change to the wrapped execution window. It
does not identify which child process wrote the file or prove that the XML
describes the command's real tests. `check` has no before-snapshot and therefore
emits `HCI107_FRESHNESS_UNVERIFIED`.

Glob matches are workspace-relative, do not follow symbolic links, are resolved
to canonical paths, and are deduplicated before parsing. A file resolving
outside the workspace is rejected as input rather than inspected.

## JUnit interpretation

The parser accepts a `<testsuite>` or `<testsuites>` root.
It removes namespace prefixes, aggregates nested suites and multiple files, and
counts explicit `<testcase>` children when they exist. If a suite contains no
testcase children or nested suites, HonestCI uses its non-negative `tests`,
`failures`, `errors`, `skipped`, and `disabled` counters; absent or invalid
counters contribute zero.

XML is validated before parsing. DTD and entity declarations are rejected and
entity processing is disabled. HonestCI does not validate against a universal
JUnit XSD because producers do not share one universal schema.

For each named report, evaluation checks:

- whether at least one file matched and parsed;
- whether the observed total is zero or below `min_tests`;
- whether failures or errors are nonzero;
- whether the skipped percentage exceeds `max_skipped_percent`; and
- whether the count drop from the same named baseline report exceeds
  `max_drop_percent`.

For a positive baseline count, drop percentage is
`max(0, (baseline - current) / baseline * 100)`. A higher current count therefore
has a zero-percent drop. No percentage comparison is made when the threshold is
`null`, the named baseline entry is absent, or its test count is zero.

## Baseline trust boundary

The baseline is versioned JSON keyed by report name. When a command is supplied,
`baseline write` snapshots the reports, runs the command, and writes only if the
command succeeds and the reports pass the fixed and freshness checks. The
command is optional for compatibility; without one, the existing reports can be
written with `HCI107_FRESHNESS_UNVERIFIED`. Baseline output uses a temporary file
and rename inside the workspace.

On a pull request, the Action obtains the base commit SHA from the event and
requests the configured baseline path at that exact revision. Its SHA-256 and
size are recorded in an evidence bundle when one is requested. This prevents a
pull request from lowering the comparison value merely by changing its workspace
baseline. A missing token or unreadable base baseline reduces the available
evidence and emits `HCI106_BASELINE_UNAVAILABLE`; fixed report and minimum checks
still run. If the path does not exist at the base revision, the run instead has
no baseline and reports `HCI101_BASELINE_MISSING`.

The configuration and workflow are still taken from the checked-out workspace.
HonestCI does not stop a pull request from proposing `max_drop_percent: null`, a
lower minimum, or a different command. Repositories that treat HonestCI as a
required control should protect these files with review ownership and branch
rules.

## Workflow linting

The linter parses configured GitHub Actions YAML and looks for narrowly defined
patterns in jobs and steps: `continue-on-error: true`, `|| true`, forced
`exit 0`, `--passWithNoTests`, and dynamic conditions on test-like work.

These findings remain warnings because static YAML inspection cannot establish
runtime reachability or intent. The linter does not evaluate expressions,
expand reusable workflows, execute matrices, or prove that every required job
ran.

## CheckResult and Action outputs

`CheckResult` schema version 1 contains:

- overall `status` and aggregate test totals;
- aggregate baseline count and drop percentage when every named report has a
  baseline entry;
- per-report files, totals, baseline count, and drop percentage; and
- ordered findings with stable code, severity, message, and optional location.

The Action maps aggregate values to `tests`, `failures`, `errors`, `skipped`,
`baseline-tests`, `drop-percent`, and `warnings`. `evidence-path` is set only
when a bundle was requested and written. It emits annotations for every finding
and writes the same report totals and findings to the Job Summary. It does not
post pull-request comments.

Finding codes and required schema meanings are compatibility contracts during
1.x. Consumers should branch on codes and documented fields rather than parsing
human messages.

## Evidence Bundle v1

The optional bundle uses `format: rigorgraph-evidence-bundle`, schema version 1,
profile `honest-ci/check-result-v1`, and evidence type `computation`. It records
the complete `CheckResult`, producer version and creation time, artifact paths,
byte sizes, SHA-256 values, and an allowlist of GitHub repository, commit, ref,
workflow, run, attempt, and event fields when supplied by GitHub Actions.

It omits raw JUnit, test names, command strings and output, arbitrary environment
variables, actors, tokens, and secrets. Local CLI execution does not infer
provenance from Git remotes. A hash establishes byte identity only; the bundle
does not authenticate the runner or prove that the declared repository executed
the tests. See [Evidence Bundle v1](EVIDENCE_BUNDLES.md).

## Non-guarantees

HonestCI does not prove test completeness, assertion quality, coverage, absence
of flakiness, workflow reachability, runner identity, repository integrity, or
program correctness. It cannot detect a runner or producer that deliberately
emits plausible but false JUnit. It does not sandbox the test command, retain
artifacts, host a dashboard, or protect repository settings.

The supported boundary and producer-specific caveats are maintained in
[compatibility and known limitations](COMPATIBILITY.md). Security-sensitive
changes should also be reviewed against the [threat model](THREAT_MODEL.md).
