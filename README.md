# HonestCI

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md)

[![CI](https://github.com/f0909172434/honest-ci/actions/workflows/ci.yml/badge.svg)](https://github.com/f0909172434/honest-ci/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/honest-ci)](https://www.npmjs.com/package/honest-ci)
[![license](https://img.shields.io/github/license/f0909172434/honest-ci)](LICENSE)
[Security policy](SECURITY.md)

**Make green CI mean the tests you expected actually ran.**

HonestCI wraps a test command, verifies fresh JUnit XML evidence, compares the
observed test count with a trusted default-branch baseline, and warns about
suspicious GitHub Actions patterns.

![A reproducible false-green run before and after HonestCI](launch/assets/false-green-before-after.png)

The [reproducible demo](launch/DEMO.md) uses the same zero-test runner twice:
it exits successfully on its own, then HonestCI blocks it with
`HCI004_ZERO_TESTS`.

For a broader local check, `npm run demo:scenarios` reproduces seven isolated
missing, zero-test, stale, reduced-count, failing-test, and report-discovery
cases. See the [scenario matrix](demo/scenarios/README.md).

```text
Ordinary runner:  npm test || true                 -> green
With HonestCI:    missing, stale, or empty JUnit   -> finding -> blocked
```

HonestCI complements test reporters. A reporter makes results readable;
HonestCI checks whether the expected evidence is fresh and whether the observed
test count still matches a trusted baseline. You can use both in the same job.

Release status: `v1.0.4`. Stable 1.x interfaces are additive. Use the protected
semantic-version tag `v1.0.4` for reproducibility; the moving `v1` Action tag
follows the latest compatible 1.x release.

## Capabilities at a glance

| Signal | What HonestCI evaluates | Result |
| --- | --- | --- |
| Test command | The wrapped command's exit status | Nonzero is a hard finding |
| JUnit reports | Presence, parseability, freshness, tests, failures, errors, and skipped tests | Definite problems fail the gate |
| Test-count baseline | Current count versus the same named report on the trusted baseline | A drop beyond your threshold fails |
| Workflow YAML | Common false-green patterns such as swallowed exits or permissive conditions | Heuristics are warnings, never proof |
| Evidence output | Result plus hashes and allowlisted GitHub provenance | Optional JSON bundle for retention or downstream use |

The Action adds annotations and a Job Summary. It also exposes `tests`,
`failures`, `errors`, `skipped`, `baseline-tests`, `drop-percent`, `warnings`,
and `evidence-path` outputs for later workflow steps.

## Five-minute Quick Start

This complete Vitest example wraps the test command, retains evidence on both
pass and fail, and uses the pull request base commit as the trusted baseline.
For Jest, pytest, or Maven, keep the structure and substitute a command from
the [runner recipes](docs/RUNNER_RECIPES.md).

First add `honest-ci.yml`:

```yaml
version: 1
reports:
  - name: unit
    paths: [reports/junit*.xml]
    format: junit
    min_tests: 1
    max_drop_percent: 10
    max_skipped_percent: null
baseline:
  file: .honest-ci/baseline.json
  source: default-branch
workflows:
  paths:
    - .github/workflows/*.yml
    - .github/workflows/*.yaml
```

Then add `.github/workflows/tests.yml`:

```yaml
name: tests

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - name: Run tests through HonestCI
        id: honest_ci
        uses: f0909172434/honest-ci@v1.0.4
        with:
          command: npm test -- --reporter=default --reporter=junit --outputFile.junit=reports/junit.xml
          config: honest-ci.yml
          github-token: ${{ github.token }}
          evidence-output: .honest-ci/evidence.json
      - name: Upload HonestCI evidence
        if: always()
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7
        with:
          name: honest-ci-evidence
          path: .honest-ci/evidence.json
```

Expected outcome: a fresh report with at least one test, no failures or errors,
and no configured threshold violation passes. A missing or stale report, zero
tests, a failed command, or an excessive baseline drop fails the Action and
adds a stable `HCI...` annotation. The first run without a baseline can still
pass its fixed checks, with `HCI101_BASELINE_MISSING` as a warning.

The Action needs only `contents: read`. It does not comment on pull requests or
upload evidence automatically; both behaviors remain explicit workflow choices.

After a successful default-branch run, create and review the baseline:

```console
npm install --save-dev honest-ci@1.0.4
npx honest-ci baseline write --config honest-ci.yml -- npm test -- --reporter=junit --outputFile=reports/junit.xml
git add .honest-ci/baseline.json
git commit -m "Add HonestCI baseline"
```

Use the same tested JUnit command when writing the baseline. On pull requests,
the Action reads the committed file from the base commit through the GitHub API,
so the pull request cannot lower its own baseline merely by editing the workspace
copy. See the [adoption guide](docs/ADOPTION_GUIDE.md) for advisory rollout,
multiple suites, threshold selection, and branch-protection guidance.

## What it catches

Definite, observable problems fail the run:

- the wrapped command returned nonzero;
- a required report is missing, malformed, unsafe, or unchanged;
- zero tests ran, the configured minimum was missed, or failures/errors exist;
- the test count fell beyond the committed baseline threshold; or
- the skipped ratio exceeded an explicitly configured limit.

Heuristics remain warnings, including `continue-on-error: true`, `|| true`,
forced `exit 0`, Jest/Vitest `--passWithNoTests`, and dynamic conditions that
may skip a test-like job or step. See the stable [finding codes](docs/FINDINGS.md).

## Result and failure semantics

The GitHub Action fails its step when at least one definite error finding is
present. Warnings are reported but do not fail the step. Invalid configuration,
unsafe paths, or other unevaluable input also fail the Action as an input error.

The CLI uses three exit statuses:

- `0`: evaluable result with no definite error finding (warnings may exist);
- `1`: one or more definite findings, such as a failed command or invalid report;
- `2`: the configuration or input could not be evaluated.

Finding codes are the stable automation interface. Human-readable messages may
improve during 1.x without changing a code's meaning.

## How the gate works

```text
honest-ci.yml + trusted baseline
              |
              v
snapshot reports -> run test command -> discover and parse fresh JUnit
                                              |
workflow lint warnings -----------------------+
                                              v
                              thresholds + finding codes
                                              |
                         +--------------------+-------------------+
                         v                    v                   v
                  exit / Action status   annotations/summary   evidence JSON
```

The CLI `run` path passes the test executable and arguments directly without a
shell. The Action's `command` input is a shell command, because workflow authors
normally provide one command string. Never construct that input from
pull-request-controlled values. Paths are confined to the workspace, report
globs do not follow symlinks, and JUnit containing DTD or entity declarations is
rejected. The [technical overview](docs/TECHNICAL_OVERVIEW.md) documents the
execution paths, parser behavior, baseline trust boundary, output schema, and
security model in detail.

## When to use HonestCI

Use it when a GitHub Actions job already produces JUnit XML and a green run
should be backed by observable execution evidence. It is especially useful
when test counts should not silently drop on a pull request.

HonestCI is not the right tool for coverage analysis, flaky-test analytics,
hosted dashboards, GitLab/CircleCI workflows, or proving that assertions are
meaningful. Those remain explicit non-goals in 1.x.

HonestCI also does not make `honest-ci.yml` or workflow files immutable. A pull
request may propose weaker thresholds or a different command, so protect those
files with normal review, CODEOWNERS, and branch rules when they are part of a
required gate.

## CLI

HonestCI requires Node.js 20 or newer.

```console
npm install --save-dev honest-ci@1.0.4
npx honest-ci lint --config honest-ci.yml
npx honest-ci run --config honest-ci.yml --evidence-output .honest-ci/evidence.json -- npm test -- --reporter=default --reporter=junit --outputFile.junit=reports/junit.xml
npx honest-ci check --config honest-ci.yml
npx honest-ci baseline write --config honest-ci.yml -- npm test -- --reporter=default --reporter=junit --outputFile.junit=reports/junit.xml
```

Use `--format pretty` for people or `--format json` for automation. Exit status
is 0 for pass, 1 for definite findings, and 2 for invalid input or configuration.
Passing a test command to `baseline write` is recommended: HonestCI writes the
baseline only when the command succeeds and the configured reports are fresh.
The command remains optional for compatibility, but existing reports then carry
`HCI107_FRESHNESS_UNVERIFIED`.

## Evidence Bundle v1

`run` and `check` accept `--evidence-output <relative-path>`. The GitHub Action
accepts the same input and returns `evidence-path`. Upload remains an explicit
workflow choice:

```yaml
- name: Upload HonestCI evidence
  if: always()
  uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7
  with:
    name: honest-ci-evidence
    path: .honest-ci/evidence.json
```

The bundle contains the result, hashes of the configuration/report/baseline/
workflow, and allowlisted GitHub provenance. It contains no raw JUnit, test
names, logs, arbitrary environment variables, or secrets. Hashes preserve
observed bytes; they do not prove runner authenticity, test quality, or
correctness. See [Evidence Bundle v1](docs/EVIDENCE_BUNDLES.md).

## Reproduce the checks locally

```console
npm ci
npm run demo:scenarios
```

The seven temporary scenarios assert the expected exit status and finding code.
The original before/after zero-test proof remains available as
`npm run demo:verify`. These demos prove that the fixtures are detected; they do
not prove that HonestCI finds every possible CI defect.

## Trusted baselines

On a pull request, the Action fetches `.honest-ci/baseline.json` from the base
commit through the GitHub API. A pull request cannot lower its own comparison
target by editing the workspace copy. If a fork cannot fetch the baseline,
HonestCI keeps its fixed minimum checks and emits
`HCI106_BASELINE_UNAVAILABLE`.

## Scope and documentation

HonestCI v1 supports GitHub Actions and JUnit XML on Ubuntu, Windows, and
macOS. It does not execute workflow YAML, provide a hosted service, analyze
coverage, support GitLab/CircleCI/TRX, call an AI API, or post pull request
comments.

HonestCI verifies observable CI execution evidence. It does not prove that
tests are sufficient, that assertions are meaningful, that all desired tests
exist, or that a program is correct.

[Configuration](docs/CONFIGURATION.md) ·
[Adoption guide](docs/ADOPTION_GUIDE.md) ·
[Technical overview](docs/TECHNICAL_OVERVIEW.md) ·
[Runner recipes](docs/RUNNER_RECIPES.md) ·
[Compatibility and limitations](docs/COMPATIBILITY.md) ·
[Release policy](docs/RELEASE_POLICY.md) ·
[Security](SECURITY.md) ·
[Threat model](docs/THREAT_MODEL.md) ·
[Contributing](CONTRIBUTING.md) ·
[Maintenance](docs/MAINTENANCE.md) ·
[Public adoption evidence](ADOPTION.md)

MIT License.
