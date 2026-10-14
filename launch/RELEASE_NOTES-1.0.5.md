# HonestCI 1.0.5

HonestCI 1.0.5 is a dependency maintenance release.

Report and workflow discovery now uses `tinyglobby` instead of `fast-glob`.
`fast-glob` pulled in `braces` <= 3.0.3, which has a high stack-exhaustion
advisory (GHSA-vfj7-8cjw-p6xm) with no patched release. Glob options and
matching results are unchanged, including dot files, symbolic links, and the
workspace boundary check. The bundled `undici` is updated to 6.29.0, which
fixes two WebSocket denial-of-service advisories.

The repository and Action reference remain `f0909172434/honest-ci@v1.0.5`, and
the npm package remains `honest-ci`. There are no changes to runtime behavior,
CLI commands, configuration, finding codes, exit codes, Action inputs or
outputs, or Evidence Bundle v1 fields.

The exact public npm version must pass the six-job Ubuntu, macOS, and Windows
registry-smoke matrix on Node.js 20 and 24 before the Marketplace listing is
updated.
