# HonestCI 1.0.3

HonestCI 1.0.3 changes the GitHub Action display name to `HonestCI Evidence
Gate`. GitHub Marketplace requires a globally unique Action name, and the
shorter `HonestCI` name conflicts with an existing GitHub account.

The repository and installation reference remain
`f0909172434/honest-ci@v1.0.3`, and the npm package remains `honest-ci`.
There are no changes to runtime behavior, CLI commands, configuration, finding
codes, exit codes, Action inputs or outputs, or Evidence Bundle v1 fields.

The exact public npm version must pass the six-job Ubuntu, macOS, and Windows
registry-smoke matrix on Node.js 20 and 24 before Marketplace publication.
