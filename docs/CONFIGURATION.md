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

All paths and glob patterns must be relative and remain inside the workspace. Symlinks are not followed while expanding globs, and resolved report files are checked again before reading.

`min_tests` is a hard lower bound. `max_drop_percent` compares a report with the same name in the trusted baseline. `max_skipped_percent` is disabled with `null`.

Run `honest-ci baseline write --config honest-ci.yml` only after a successful run on the default branch, review the generated JSON, and commit it. On a pull request, the Action reads this file at the base commit through GitHub's API; a copy changed by the pull request is not trusted.
