# Evidence Bundle v1

HonestCI can emit a RigorGraph Evidence Bundle v1 after an evaluable `run` or `check`, whether the result passed or failed.

```console
npx honest-ci run --config honest-ci.yml --evidence-output .honest-ci/evidence.json -- npm test
```

The GitHub Action uses the same `evidence-output` input and exposes `evidence-path`. It does not upload automatically; use `actions/upload-artifact` explicitly with `if: always()` when the failed result must be preserved.

## Contents

The bundle uses `format: rigorgraph-evidence-bundle`, `schema_version: 1`, profile `honest-ci/check-result-v1`, and `evidence_type: computation`. It includes HonestCI `CheckResult` v1, the producer version, creation time, SHA-256 and byte size for observed configuration, JUnit reports, baseline and inspected workflow files, plus allowlisted GitHub repository, commit, ref, workflow, run and event provenance.

It never includes JUnit XML, test names, command output, raw commands, arbitrary environment variables, actors, tokens, or secrets. Local CLI execution does not inspect Git remotes; provenance is omitted unless GitHub Actions provides the allowlisted values.

## Compatibility and trust

Required v1 fields and meanings are stable throughout HonestCI 1.x. Optional fields and finding codes may be added. A breaking change requires bundle schema v2 or HonestCI 2.x.

SHA-256 preserves the bytes HonestCI observed. The bundle does not authenticate the runner, prove that the declared repository executed the code, establish test quality, or prove program correctness. RigorGraph imports it as computation evidence and never promotes a claim automatically.
