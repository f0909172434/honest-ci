# No-telemetry 30/90-day measurement plan

HonestCI does not add telemetry for launch measurement. Record only public, opt-in, or maintainer-observed evidence, with links where privacy permits. A fixed number of users is not permission to continue development or release.

## Baseline snapshot at approval

Record on the day the launch batch is approved:

| Signal | Baseline | Evidence |
| --- | ---: | --- |
| GitHub stars | fill from repository page | public repository URL |
| Confirmed external repositories using HonestCI | fill from verifiable public workflows or opt-in reports | repository/workflow links |
| Public issues | fill from GitHub | issue query URL |
| External contributors | fill from merged commits/PRs | contributor/PR links |
| Reproduced real false-green findings | fill only when the case and finding are verified | sanitized fixture or issue |
| Verified hard false positives | fill only after reproduction | issue and regression test |

Do not infer users from page views, clone counts, release-asset downloads, stars, or reactions. Do not publish private repository names or logs.

## Day 30 review

Capture the same table plus:

- Which Quick Start step most often blocked completion.
- Median or range of reported time from opening the README to the first useful Job Summary, only from explicit reports.
- Finding-code distribution only for verified, voluntarily reported cases.
- Number of onboarding issues closed with a tested documentation or product change.

Decision rules:

- If no external repository is confirmed, do not add formats or platforms. Recheck whether the first screen names a recognizable pain, whether the demo runs unchanged, and whether the release-asset install is obvious.
- If people reach the repository but cannot finish, prioritize install, runner recipes, baseline creation, permissions, and error messages.
- If hard false positives appear, stop promotion of the affected claim, reproduce them, add regression tests, and fix correctness before expanding reach.
- If questions repeatedly expect coverage or correctness guarantees, tighten positioning and the limitation sentence before adding features.

## Day 90 review

Repeat the evidence table and classify outcomes:

- Adoption signal: at least one verifiable external workflow or opt-in completion report.
- Problem signal: at least one reproducible false-green case the current scope can observe.
- Trust signal: verified hard false positives and time-to-fix, including zero.
- Contribution signal: external issues, fixtures, docs, or code accepted on their merits.

Decision rules:

- Strong problem evidence but low completion: simplify onboarding before feature work.
- Completion but few useful findings: revisit positioning and target workflows; do not inflate the scope claim.
- Repeated unsupported-format requests without current-scope evidence: keep them documented as requests, not roadmap commitments.
- Healthy evidence within the current scope: ship small verified beta increments; npm or Marketplace publication still requires separate approval.
