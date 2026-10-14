---
name: honest-ci-cloud
description: Prepare and verify the HonestCI CLI and GitHub Action in a Codex Cloud checkout.
---

# HonestCI Cloud startup

Use this workflow when preparing or checking the HonestCI cloud environment.
Work from the repository root and follow `AGENTS.md` and `CONTRIBUTING.md`.

1. Use Node.js 24, or another version accepted by `package.json` (20 or newer).
2. For a fresh installation, run `bash .codex/setup.sh`. It uses the committed
   npm lockfile and builds the CLI and GitHub Action.
3. Run `npm run verify` and require every step to succeed. Report failures with
   the failing command; do not call the environment ready after a partial pass.
4. Run `node dist/cli/index.js --version` and check that it matches the version
   in `package.json`.

There is no server to start. No database, paid API, or new service credential is
required for this workflow. Package installation and the package smoke check
need HTTPS access to `registry.npmjs.org`. Keep the inherited network proxy and
TLS trust configuration. Use the connected GitHub identity for repository
operations rather than copying a token into the checkout.
