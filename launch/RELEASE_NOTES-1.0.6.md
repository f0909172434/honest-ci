# HonestCI 1.0.6

HonestCI 1.0.6 is a platform maintenance release.

Node.js 20 reached its upstream end of life on 2026-04-30. HonestCI 1.x keeps
its documented Node.js 20 CLI runtime boundary, and a dedicated CI job now
installs the packed CLI on Ubuntu, Windows, and macOS with Node.js 20 on every
change. Source CI moves to Node.js 22, 24, and 26. The GitHub Action continues
to run on the runner-provided Node.js 24 runtime.

The bundles are rebuilt with `@vercel/ncc` 0.45 and TypeScript 7. The only
bundle change is ncc's asset-path helper, which now decodes percent-encoded
install paths such as directories containing spaces. Developing HonestCI
itself now requires Node.js 22.12 or newer.

The repository and Action reference remain `f0909172434/honest-ci@v1.0.6`, and
the npm package remains `honest-ci`. There are no changes to runtime behavior,
CLI commands, configuration, finding codes, exit codes, Action inputs or
outputs, or Evidence Bundle v1 fields.

The exact public npm version must pass the twelve-job Ubuntu, macOS, and
Windows registry-smoke matrix on Node.js 20, 22, 24, and 26 before the
Marketplace listing is updated.
