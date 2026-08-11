# Maintenance workflow

This is a solo-maintainer workflow, not a guaranteed service-level agreement.
It keeps incoming attention reproducible and prevents popularity signals from
overriding release gates.

## Intake and triage

1. Route suspected vulnerabilities to Private Vulnerability Reporting. Remove
   secrets, private paths, test names, and proprietary logs from public issues.
2. Label public reports by observable type: `bug`, `false-positive`,
   `false-green`, `compatibility`, `enhancement`, or `needs-reproduction`.
3. Record the HonestCI version, operating system, Node version, JUnit producer,
   stable finding code, exit status, and smallest sanitized reproduction.
4. Treat a report as confirmed only after the maintainer can reproduce it or a
   public workflow provides equivalent evidence.

## Bug and compatibility reports

Create a failing fixture or test before changing behavior. Preserve the
distinction between hard findings and heuristic warnings. A false positive that
blocks a healthy run has priority over adding a new heuristic or report format.

For compatibility reports, classify the result as:

- **verified compatible** — a public or sanitized reproduction passes;
- **verified incompatible** — a reproduction fails for a documented reason;
- **configuration issue** — supported behavior works after a documented change;
- **unresolved** — evidence is not yet sufficient.

Update [compatibility](COMPATIBILITY.md) only from a reproducible result and
[public adoption evidence](../ADOPTION.md) only from inspectable or explicitly
opted-in evidence.

## Pull-request review

Require a focused problem statement, regression coverage, `npm run verify`,
updated bundled `dist/` output, and compatibility with stable finding meanings,
exit codes, Action inputs/outputs, configuration, and Evidence Bundle v1. Review
security-sensitive changes against the [threat model](THREAT_MODEL.md).

Do not merge a community pull request merely to improve contributor counts.
Small documentation, fixture, and runner-recipe pull requests are welcome when
they solve an observed onboarding or compatibility problem.

## Releases

Use the hard gates in [the release policy](RELEASE_POLICY.md). Summarize user-
visible changes in `CHANGELOG.md`, link the issue or pull request that motivated
each feedback-driven change, and run the public registry smoke matrix for the
exact version. Marketplace publication and public announcements remain explicit
maintainer actions.

## Weekly launch review

- Review new issues, pull requests, Discussions, and security reports.
- Reproduce definite failures and false positives before proposing a fix.
- Recheck public integration links and record only evidence-backed additions.
- Update FAQ or recipes when two independent users hit the same friction.
- Publish a patch only when deterministic gates pass; do not wait for a target
  number of stars, downloads, or testers.
