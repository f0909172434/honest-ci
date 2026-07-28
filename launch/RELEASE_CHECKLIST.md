# Release approval checklist

Stop before each item marked human approval.

- [x] Repository and npm names checked on 2026-07-28.
- [x] TypeScript CLI and bundled JavaScript Action built.
- [x] English, Traditional Chinese, Simplified Chinese, and Japanese README files prepared.
- [x] Cross-platform GitHub Actions workflow prepared.
- [ ] Five external testers complete the five-minute flow.
- [ ] Human approval: merge the beta pull request.
- [ ] Human approval and npm 2FA: publish `0.1.0-beta.1` with the `next` tag.
- [ ] Human approval: create signed `v0.1.0-beta.1` and moving `v0` tags.
- [ ] Human approval and agreement: submit the Action to GitHub Marketplace.
- [ ] Human approval: send public launch posts.

Before approval, rerun `npm ci`, `npm run verify`, `npm pack --dry-run`, a clean tarball install, and the real GitHub Action matrix.
