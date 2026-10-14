#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

node -e 'const major = Number(process.versions.node.split(".")[0]); if (major < 20) { console.error("HonestCI requires Node.js 20 or newer; Node.js 24 is recommended for Codex Cloud."); process.exit(1); }'
npm ci
npm run build
