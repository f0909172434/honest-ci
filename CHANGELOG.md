# Changelog

## 1.0.5

- Replace `fast-glob` with `tinyglobby` for report and workflow discovery.
  `fast-glob` depended on `braces` <= 3.0.3, which has a high
  stack-exhaustion advisory (GHSA-vfj7-8cjw-p6xm) and no patched release.
  Matching options and results are unchanged, including dot files,
  symbolic links, and the workspace boundary check.
- Update bundled runtime dependencies: `undici` 6.29.0 (fixes two WebSocket
  denial-of-service advisories), `fast-xml-parser` 5.11.2, and `yaml`.
- Runtime behavior, CLI commands, configuration, finding codes, exit codes,
  Action inputs and outputs, and Evidence Bundle v1 fields are unchanged.

## 1.0.4

- Replace the green shield Marketplace badge with a purple `check-square` to
  represent an evidence-backed CI gate instead of antivirus or security
  scanning. Runtime behavior and every public interface remain unchanged.

## 1.0.3

- Change the GitHub Action display name to `HonestCI Evidence Gate` because the
  shorter name conflicts with an existing GitHub account and cannot be listed
  in GitHub Marketplace. The repository, Action reference, npm package, inputs,
  outputs, and runtime behavior are unchanged.

## 1.0.2

- Preserve CLI arguments literally on Windows when launching npm-style command
  shims, so shell metacharacters in one argv element cannot become a second
  command.
- Normalize report paths against the canonical workspace so Windows runner path
  aliases do not turn in-workspace reports into apparent traversal paths in
  Evidence Bundle output.
- Add a seven-case executable scenario matrix, an explicit compatibility and
  limitations reference, privacy-respecting public adoption evidence rules, a
  maintenance workflow, and a compatibility-report issue form.

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
