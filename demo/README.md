# Reproducible demo

Run these commands from the repository root after `npm run build`.

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
