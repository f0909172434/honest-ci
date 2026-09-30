# Working on HonestCI

HonestCI is a TypeScript CLI and GitHub Action that checks whether the expected
tests actually ran. Use Node.js 20 or newer; Node.js 24 matches the current CI
matrix. Dependencies are locked in `package-lock.json`.

## Setup and validation

- Prepare a fresh Codex Cloud checkout with `bash .codex/setup.sh`.
- Run `npm run verify` before submitting changes. It covers type checking, tests,
  CLI and Action builds, documentation, demos, and the packed CLI smoke check.
- For focused work, use `npm run typecheck`, `npm test`, and `npm run build`.
- The built CLI is `node dist/cli/index.js`. This project does not need a
  persistent server, database, or API key for development and validation.

## Project conventions

- Follow `CONTRIBUTING.md` and review security-sensitive changes against
  `docs/THREAT_MODEL.md`.
- Keep definite failures separate from heuristic warnings. Do not give an
  existing finding code a new meaning.
- Add fixtures or regression tests when behavior changes.
- Build outputs under `dist/` are tracked; rebuild them when source changes and
  include resulting changes in the same commit.
- Keep credentials, private CI logs, and proprietary repository details out of
  source, fixtures, commits, and pull requests.
- Preserve the environment's proxy settings and TLS certificate verification.
