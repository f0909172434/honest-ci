# Contributing

Issues and focused pull requests are welcome. Before opening a change:

1. Run `npm ci`.
2. Run `npm run verify`.
3. If behavior changes, add a fixture or test that proves the old and new outcomes.
4. Keep definite failures separate from heuristic warnings.
5. Do not change an existing finding code to mean something different.
6. Review security-sensitive changes against `docs/THREAT_MODEL.md`.
7. Do not include credentials, private CI logs, test names, or proprietary
   repository details in issues, fixtures, or pull requests.

New report formats remain outside HonestCI 1.x. Real, sanitized false-green
examples and false-positive reports are especially useful. Report suspected
vulnerabilities through the private process in `SECURITY.md`, not a public issue.
