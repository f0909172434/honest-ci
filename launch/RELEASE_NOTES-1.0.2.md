# HonestCI 1.0.2

HonestCI 1.0.2 fixes two Windows execution-evidence defects found during an
external-adoption audit. CLI arguments passed after `--` now remain literal
arguments when npm-style command shims are launched, so a shell metacharacter in
one argument cannot become another command. Report paths are also normalized
against the canonical workspace, preventing GitHub runner path aliases from
making an in-workspace report look like traversal during evidence output.

The release adds focused Windows regressions, a seven-case executable scenario
matrix, an explicit compatibility and limitations reference, privacy-respecting
public adoption evidence rules, a maintenance workflow, and a compatibility
report issue form. Existing finding meanings, exit codes, CLI JSON, Action
inputs and outputs, configuration semantics, and Evidence Bundle v1 required
fields remain compatible.

The source Action is validated on GitHub-hosted Ubuntu, macOS, and Windows with
Node.js 20 and 24. The exact public npm version must pass the same six-job
registry-smoke matrix before Marketplace publication.
