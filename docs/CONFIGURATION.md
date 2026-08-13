# Configuration reference

HonestCI reads `honest-ci.yml` from the workspace root unless `--config` or the Action `config` input selects another file.

```yaml
version: 1
reports:
  - name: unit
    paths:
      - reports/junit*.xml
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
```

## Field reference

| Field | Required | Default | Meaning |
| --- | --- | --- | --- |
| `version` | Yes | — | Configuration schema; the only accepted value in 1.x is `1`. |
| `reports` | Yes | — | Non-empty list of named report groups. Names must be unique and become baseline comparison keys. |
| `reports[].name` | Yes | — | Stable identity for one logical suite. |
| `reports[].paths` | Yes | — | Non-empty list of workspace-relative JUnit globs. Matches are deduplicated and aggregated. |
| `reports[].format` | Yes | — | Must be `junit` in 1.x. |
| `reports[].min_tests` | No | `1` | Non-negative hard lower bound, enforced even without a baseline. |
| `reports[].max_drop_percent` | No | `null` | Maximum drop from the same named baseline report, from 0 through 100; `null` disables it. |
| `reports[].max_skipped_percent` | No | `null` | Maximum skipped share, from 0 through 100; `null` disables it. |
| `baseline.file` | No | `.honest-ci/baseline.json` | Workspace-relative committed baseline path. |
| `baseline.source` | No | `default-branch` | Trust model selector; the only accepted value in 1.x is `default-branch`. |
| `workflows.paths` | No | `.github/workflows/*.yml` and `*.yaml` | Workspace-relative workflow globs inspected for heuristic warnings. |

All paths and glob patterns must be relative and remain inside the workspace.
Absolute paths and `..` traversal are rejected. Symlinks are not followed while
expanding globs, and resolved report files are checked again before reading.

`min_tests` is independent from the baseline. `max_drop_percent` compares a
report with the same name in the trusted baseline. `max_skipped_percent` divides
the aggregate skipped count by the aggregate test count for that named report.
Percentage thresholds are exceeded only when the observed percentage is greater
than the configured value, so equality passes.

## Baseline lifecycle

On the default branch, prefer `honest-ci baseline write --config honest-ci.yml -- <test-command>` so HonestCI proves the reports are fresh before writing. Review the generated JSON and commit it. The command is optional for compatibility; without it, HonestCI reports `HCI107_FRESHNESS_UNVERIFIED`. On a pull request, the Action reads this file at the base commit through GitHub's API; a copy changed by the pull request is not trusted.

For rollout and intentional test-count changes, see the
[adoption guide](ADOPTION_GUIDE.md). For exact calculation, file discovery, and
trust-boundary behavior, see the [technical overview](TECHNICAL_OVERVIEW.md).
