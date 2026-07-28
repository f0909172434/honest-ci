# Release approval checklist

Stop before each item marked human approval.

- [x] Repository and npm names checked on 2026-07-28.
- [x] TypeScript CLI and bundled JavaScript Action built.
- [x] English, Traditional Chinese, Simplified Chinese, and Japanese README files prepared.
- [x] Cross-platform GitHub Actions workflow prepared.
- [x] Human approval: merge the beta pull request.
- [x] Hard beta gates pass without waiting for a fixed number of external testers.
- [x] GitHub pre-release `v0.1.0-beta.1` published from validated commit `f9c3926912d33ccc070ccfff6c956759e0f687f8` with a CLI tarball asset.
- [x] Release-asset install path tested from a clean temporary project.
- [x] Launch package, executable before/after demo, and evidence image prepared without publishing posts.
- [ ] Human approval: approve the exact batch in `launch/APPROVAL_BATCH.md` after its PR URL, merged commit, check run, accounts, and times are filled.
- [ ] Human approval and npm 2FA: publish `0.1.0-beta.1` with the `next` tag.
- [ ] After the beta proves stable, decide whether to create a moving `v0` tag.
- [ ] Human approval and agreement: submit the Action to GitHub Marketplace.
- [ ] Human approval: send public launch posts.

External testing is a post-release evidence target, not a beta blocker. Track distinct external installs, real false-green findings, hard false positives, and onboarding failures as they arrive.

Before any future release, rerun `npm ci`, `npm run verify`, `npm pack --dry-run`, a clean tarball install, and the real GitHub Action matrix.
