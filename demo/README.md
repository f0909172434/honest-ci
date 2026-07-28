# Reproducible demo

Run these commands from the repository root after `npm run build`.

## First-screen before/after

The launch demo uses the same misconfigured runner twice. It writes JUnit XML containing zero tests but exits successfully.

Without HonestCI, the command returns 0 and ordinary CI stays green:

```console
node demo/launch/false-green-runner.mjs
```

Wrap that exact runner with HonestCI and the observable zero-test report blocks the run with exit 1 and `HCI004_ZERO_TESTS`:

```console
node dist/cli/index.js run --config demo/launch/honest-ci.yml -- node demo/launch/false-green-runner.mjs
```

Run `npm run demo:verify` to assert both exit codes and the finding. This demonstrates only that the report contained zero tests despite a successful runner exit; it does not establish test quality or program correctness.

## Static lint and healthy fixtures

The intentionally false-green workflow produces only warnings from static linting because those patterns are suspicious, not proof of a bad run:

```console
node dist/cli/index.js lint --config demo/false-green/honest-ci.yml
```

The zero-test report is observable evidence, so it is a hard failure with `HCI004_ZERO_TESTS`:

```console
node dist/cli/index.js check --config demo/false-green/honest-ci.yml
```

The healthy fixture passes all hard checks. Standalone `check` still emits `HCI107_FRESHNESS_UNVERIFIED`; use `run` or the Action to prove that the current test command changed the report.

```console
node dist/cli/index.js check --config demo/healthy/honest-ci.yml
```
