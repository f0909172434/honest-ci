# HonestCI 1.0.4

HonestCI 1.0.4 replaces the green shield Marketplace badge with a purple
`check-square`. The new badge represents a test-evidence check and CI gate,
avoiding the misleading appearance of an antivirus or security scanner.

The display name remains `HonestCI Evidence Gate`, the repository and Action
reference remain `f0909172434/honest-ci@v1.0.4`, and the npm package remains
`honest-ci`. There are no changes to runtime behavior, CLI commands,
configuration, finding codes, exit codes, Action inputs or outputs, or Evidence
Bundle v1 fields.

The exact public npm version must pass the six-job Ubuntu, macOS, and Windows
registry-smoke matrix on Node.js 20 and 24 before the Marketplace listing is
updated.
