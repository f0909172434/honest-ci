# HonestCI 1.0.0-rc.1

HonestCI 1.0 adds an additive RigorGraph Evidence Bundle v1 without changing the existing JUnit, finding-code, exit-code, baseline, or Action semantics.

`run` and `check` can preserve passed or failed results with `--evidence-output`. The Action exposes the same input and an `evidence-path` output. Bundles contain configuration, report, baseline, and workflow hashes plus allowlisted GitHub provenance; they exclude raw JUnit, test names, logs, arbitrary environment variables, and secrets.

This release candidate remains limited to GitHub Actions and JUnit XML. It does not prove test quality, runner authenticity, or program correctness. Stable 1.0 requires cross-platform fresh installs and a successful import into the matching RigorGraph RC.
