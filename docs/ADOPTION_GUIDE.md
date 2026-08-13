# Adoption guide

HonestCI works best as a narrow evidence gate around a test command that already
produces JUnit XML. It does not require a hosted service, account, database, or
telemetry endpoint. This guide moves from observation to enforcement without
claiming more trust than the available evidence supports.

## Choose an integration mode

| Mode | Command or Action setup | What it establishes | Important limit |
| --- | --- | --- | --- |
| Workflow lint | `npx honest-ci lint --config honest-ci.yml` | Reports suspicious GitHub Actions patterns | Heuristics are warnings and the lint command does not fail on them |
| Existing-report check | `npx honest-ci check --config honest-ci.yml`, or Action without `command` | Parses reports and enforces counts, failures, errors, skips, and baseline thresholds | Emits `HCI107_FRESHNESS_UNVERIFIED`; it cannot link the report to the current test process |
| Wrapped execution | `npx honest-ci run ... -- <test-command>`, or Action with `command` | Adds command exit status and report freshness to the report checks | The operator-supplied command is trusted and is not sandboxed |

Use wrapped execution for a required CI gate. Existing-report mode is useful
when a legacy pipeline cannot combine test execution and validation yet, but its
freshness warning should remain visible.

## A staged rollout

### 1. Make the report deterministic

Configure the runner to write JUnit to a stable path on every run. Verify the
path in both the test command and `honest-ci.yml`; a mismatch correctly appears
as `HCI001_MISSING_REPORT`.

Start with fixed checks and no percentage policy:

```yaml
version: 1
reports:
  - name: unit
    paths: [reports/junit.xml]
    format: junit
    min_tests: 1
    max_drop_percent: null
    max_skipped_percent: null
baseline:
  file: .honest-ci/baseline.json
  source: default-branch
workflows:
  paths:
    - .github/workflows/*.yml
    - .github/workflows/*.yaml
```

At this stage, missing, invalid, stale, empty, or failing reports still block
wrapped runs. `HCI101_BASELINE_MISSING` is a warning until a baseline exists.

### 2. Observe the gate on representative jobs

Run HonestCI on the operating systems, test shards, and pull-request sources you
actually use. In particular, exercise a fork pull request if external
contributors matter: token restrictions can make the base-commit baseline
unavailable. Fixed minimum and report checks continue, while
`HCI106_BASELINE_UNAVAILABLE` records the reduced evidence.

Do not classify a warning as a product defect until the workflow is inspected.
Static findings such as `HCI105_DYNAMIC_CONDITION` intentionally report a risk,
not proof that a test was skipped.

### 3. Commit a reviewed baseline

From a clean checkout of a healthy default branch, install the pinned CLI and
write a fresh baseline with the same command used in CI:

```console
npm install --save-dev honest-ci@1.0.4
npx honest-ci baseline write --config honest-ci.yml -- npm test -- --reporter=default --reporter=junit --outputFile.junit=reports/junit.xml
git diff -- .honest-ci/baseline.json
git add .honest-ci/baseline.json
git commit -m "Add HonestCI test-count baseline"
```

`baseline write` writes only after the command succeeds and the configured
reports pass the fixed checks and freshness test. Review the generated counts;
the command verifies observation, not whether the count is the desired policy.

### 4. Select explicit thresholds

Set `max_drop_percent` only after seeing normal variation. For a baseline of 200
tests, a value of `5` allows 190 tests but rejects 189. Set
`max_skipped_percent` only if skipped tests have a stable meaning in the runner.
`min_tests` remains an absolute floor even when no trusted baseline is available.

For multiple suites, give every logical suite a stable name:

```yaml
reports:
  - name: unit
    paths: [reports/unit-*.xml]
    format: junit
    min_tests: 100
    max_drop_percent: 5
    max_skipped_percent: 2
  - name: integration
    paths: [reports/integration/*.xml]
    format: junit
    min_tests: 10
    max_drop_percent: 10
    max_skipped_percent: null
```

All files matched by one report are deduplicated and aggregated. Baseline
comparison is by report name, so renaming a report also changes its comparison
identity.

### 5. Make the gate required

Once representative runs behave as expected, make the job's stable name a
required check in the repository's branch rules. Add review ownership for
`honest-ci.yml`, `.honest-ci/baseline.json`, and the workflow that invokes the
Action. HonestCI protects a pull-request baseline by reading it from the base
commit, but it does not independently protect the configuration or workflow
from review-approved changes.

Prefer the immutable `f0909172434/honest-ci@v1.0.4` reference for reproducible
workflows. The `v1` tag intentionally moves to compatible 1.x releases.

## Intentional test-count changes

When a test-count reduction is expected, keep the evidence visible in review:

1. explain which tests were removed or consolidated;
2. let the pull request compare against the existing base-commit baseline;
3. obtain the repository's required review for any temporary threshold or policy
   change; and
4. regenerate and review the committed baseline from the updated default branch.

HonestCI cannot decide whether a reduction is justified. Avoid silently replacing
the baseline and describing the new value as proof that the removed tests were
unnecessary.

## Operational checklist

- The test command always creates or changes every required JUnit report.
- Report names and paths are stable across the default branch and pull requests.
- `min_tests` remains meaningful when the trusted baseline is unavailable.
- Evidence upload uses `if: always()` if failed results must be retained.
- Workflow and policy files receive code-owner review if the check is required.
- Finding codes, not message text, drive any downstream automation.
- A false positive or compatibility result is reported with a sanitized,
  reproducible fixture rather than private logs.

See the [configuration reference](CONFIGURATION.md), [runner recipes](RUNNER_RECIPES.md),
[finding codes](FINDINGS.md), [compatibility limits](COMPATIBILITY.md), and
[technical overview](TECHNICAL_OVERVIEW.md) for the corresponding contracts.
