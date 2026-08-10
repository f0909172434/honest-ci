# Changelog

## 1.0.1

- Allow `baseline write -- <test-command>` to prove the configured reports are fresh before replacing the committed baseline, while preserving the existing no-command workflow with an explicit freshness warning.
- Enforce canonical workspace boundaries for configuration, workflow, report, and baseline paths, including linked-directory and junction regression coverage.
- Add a stable cross-platform CI gate, CodeQL, Dependabot, immutable Action pins, a canonical security policy, and an explicit threat model.

## 1.0.0

- Promote additive Evidence Bundle v1 output after RigorGraph interoperability tests.
- Confirm public npm installs on Windows, Ubuntu, and macOS with Node.js 20 and 24.
- Publish reproducible CLI and Action bundles with checksums, attestations, npm OIDC, and provenance.
- Preserve exit codes, finding meanings, CLI JSON, Action inputs/outputs, and existing configuration semantics.

## 1.0.0-rc.1

- Add RigorGraph Evidence Bundle v1 output to `run`, `check`, and the GitHub Action.
- Preserve passed and failed CI results with configuration, report, baseline, workflow, and allowlisted provenance hashes.
- Add additive 1.x compatibility and OIDC release policies.

## 0.1.0-beta.1

- Initial public beta CLI, GitHub Action, JUnit checks, trusted baseline, stable findings, and false-green demo.
