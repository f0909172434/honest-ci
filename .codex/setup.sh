#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

node -e 'const [major, minor] = process.versions.node.split(".").map(Number); if (major < 22 || (major === 22 && minor < 12)) { console.error("HonestCI development requires Node.js 22.12 or newer; Node.js 24 is recommended for Codex Cloud."); process.exit(1); }'
npm ci
npm run build
