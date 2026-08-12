# Launch demo: false green to correctly blocked

This demo is executable evidence, not a product-quality claim. The same intentionally misconfigured runner writes JUnit XML with zero tests and exits 0 in both cases.

## Reproduce from a source checkout

```console
npm ci
npm run build
node demo/launch/false-green-runner.mjs
```

Expected first result:

```text
test runner: wrote JUnit XML with tests=0
test runner: exited 0, so ordinary CI stays green
```

The command exits 0. Ordinary CI has no failing process to block.

Now wrap the identical runner:

```console
node dist/cli/index.js run --config demo/launch/honest-ci.yml -- node demo/launch/false-green-runner.mjs
```

Expected decisive output:

```text
HonestCI FAILED
Tests: 0  Failures: 0  Errors: 0  Skipped: 0
ERROR HCI004_ZERO_TESTS Report "unit" contains zero tests.
```

The wrapped command exits 1. Run the automated assertion with:

```console
npm run demo:verify
```

The verifier checks the before exit is 0, the after exit is 1, `HCI004_ZERO_TESTS` is present, and the result is not attributed to stale-report evidence.

## Copyable stable Quick Start

The four README files contain the complete workflow and configuration. Install
the published immutable npm version:

```console
npm install --save-dev honest-ci@1.0.4
npx honest-ci baseline write --config honest-ci.yml
```

The repository's `npm run verify` repeats a local pack, clean install, CLI
version check, and one-test JUnit check on every run. Public-registry installs
are checked separately for the exact released version.

For missing, zero-test, stale, reduced-count, failing-test, and discovery cases,
run `npm run demo:scenarios` and see the [scenario matrix](../demo/scenarios/README.md).

## Claim boundary

This demo proves only that the runner returned success while its observable JUnit evidence contained zero tests, and that HonestCI blocked that condition. It does not prove that any test suite is sufficient, assertions are meaningful, all desired tests exist, or a program is correct.
