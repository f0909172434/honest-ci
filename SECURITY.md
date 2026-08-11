# Security policy

## Supported versions

The latest HonestCI 1.x release receives security fixes. Older 1.x releases
may require upgrading to the latest compatible patch. Pre-release and source
snapshots are supported only while they are under active development.

## Report a vulnerability

Use the repository's **Private vulnerability reporting** form under
**Security > Advisories**. Do not put exploit details, credentials, private CI
logs, vulnerable source excerpts, or repository secrets in a public issue.

Include the affected version, operating system, minimal reproduction, expected
security boundary, and observed impact. If the report involves a workflow or
JUnit document, remove tokens, private paths, test names, and proprietary data.

## Security boundaries

- HonestCI parses workflow YAML but never evaluates or executes that YAML.
- Only the explicit command supplied to `honest-ci run` or the Action
  `command` input is executed. CLI arguments after `--` are launched as an
  argument vector without shell interpretation. The Action `command` input is
  intentionally interpreted by the runner shell and must be trusted workflow
  configuration, not pull-request-controlled data.
- JUnit containing DTD or entity declarations is rejected before parsing.
- Report and workflow paths are confined to the workspace; symlinks are not
  followed and resolved paths are checked again.
- `github-token` is used only to read a trusted baseline from the pull request
  base commit. The normal integration needs only `contents: read`.
- Evidence bundles omit raw JUnit, test names, logs, arbitrary environment
  variables, credentials, and source files.

See the [threat model](docs/THREAT_MODEL.md) for assets, trust boundaries,
assumptions, and non-goals.

## What a clean scan means

Automated dependency, static-analysis, or contextual security scans are review
evidence, not proof that a release has no vulnerabilities. Coverage gaps and
unresolved findings must be assessed separately. HonestCI's own result also
does not prove that a project's tests are sufficient or its software correct.
