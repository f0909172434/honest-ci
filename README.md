# HonestCI

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md)

Make green CI mean the tests you expected actually ran.

HonestCI wraps a test command, verifies fresh JUnit evidence, compares the observed test count with a trusted default-branch baseline, and warns about suspicious GitHub Actions patterns.

```text
Before HonestCI:  npm test || true                 → green
After HonestCI:   unchanged or missing JUnit XML   → HCI003 / HCI001 → blocked
```

Release status: public beta `v0.1.0-beta.1`. Install the Action from the immutable beta tag below. The npm package is not published yet.

## Five-minute Quick Start

First configure your test runner to write JUnit XML. Then add `honest-ci.yml`:

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
  paths: [.github/workflows/*.yml]
```

Add the Action after checkout and dependency installation. Replace the example command with the JUnit command for your runner. Pinning the immutable beta tag keeps the workflow reproducible.

```yaml
- uses: f0909172434/honest-ci@v0.1.0-beta.1
  with:
    command: npm test -- --reporter=junit --outputFile=reports/junit.xml
    config: honest-ci.yml
    github-token: ${{ github.token }}
```

After a successful default-branch run, create and review the baseline:

```console
npx honest-ci baseline write --config honest-ci.yml
git add .honest-ci/baseline.json
git commit -m "Add HonestCI baseline"
```

The Action needs only `contents: read`. It writes annotations and a Job Summary, and does not comment on pull requests.

## What it catches

Definite, observable problems fail the run:

- The wrapped command returned nonzero.
- A required report is missing, malformed, unsafe, or unchanged.
- Zero tests ran, the configured minimum was missed, or failures/errors exist.
- The test count fell beyond the committed baseline threshold.
- The skipped ratio exceeded an explicitly configured limit.

Heuristics remain warnings:

- `continue-on-error: true`
- `|| true` or forced `exit 0`
- Jest/Vitest `--passWithNoTests`
- Dynamic conditions that may skip a test-like job or step

See [finding codes](docs/FINDINGS.md) for the stable machine interface.

## CLI

Requires Node.js 20 or newer.

```console
npm install --save-dev honest-ci
npx honest-ci lint
npx honest-ci run --config honest-ci.yml -- npm test
npx honest-ci check --config honest-ci.yml
npx honest-ci baseline write --config honest-ci.yml
```

Use `--format pretty` for people or `--format json` for automation. Exit status is 0 for pass, 1 for definite findings, and 2 for invalid input or configuration.

## Reproducible false-green demo

From a source checkout:

```console
npm ci
npm run build
node dist/cli/index.js lint --config demo/false-green/honest-ci.yml
node dist/cli/index.js check --config demo/false-green/honest-ci.yml
node dist/cli/index.js check --config demo/healthy/honest-ci.yml
```

The first command warns about four common workflow patterns. The second fails because the observable JUnit report contains zero tests. The healthy fixture has no hard finding. See [demo details](demo/README.md).

## Trusted baselines

On a pull request, the Action fetches `.honest-ci/baseline.json` from the base commit through the GitHub API. A pull request cannot lower its own comparison target by editing the workspace copy. If a fork lacks permission to fetch the baseline, HonestCI keeps the fixed minimum checks and emits `HCI106_BASELINE_UNAVAILABLE`.

## Scope and limits

HonestCI v1 supports GitHub Actions and JUnit XML on Ubuntu, Windows, and macOS. It does not execute workflow YAML, provide a hosted service, analyze coverage, support GitLab/CircleCI/TRX, call an AI API, or post pull request comments.

HonestCI verifies observable CI execution evidence. It does not prove that tests are sufficient, that assertions are meaningful, that all desired tests exist, or that a program is correct.

Configuration: [docs/CONFIGURATION.md](docs/CONFIGURATION.md) · [Runner recipes](docs/RUNNER_RECIPES.md) · [Beta policy](docs/BETA_POLICY.md) · Security: [docs/SECURITY.md](docs/SECURITY.md) · Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)

MIT License
