# Security model

HonestCI parses workflow YAML but never evaluates or executes it. Only the explicit command passed to `honest-ci run` or the Action `command` input is executed.

JUnit input containing a DTD or entity declaration is rejected before parsing. External entities are not processed. Report and workflow globs are confined to the workspace, symlinks are not followed, and resolved report locations are checked again.

The Action uses `github-token` only to read the configured baseline file from the pull request base commit. It does not print the token, environment variables, or the configured command. The default integration needs only `contents: read` and does not comment on pull requests.

Treat workflow changes as code changes. HonestCI can identify observable execution gaps; it cannot establish that tests are sufficient, assertions are meaningful, or software is correct.

Report vulnerabilities privately through GitHub's security advisory interface for this repository. Do not include credentials or private CI logs in a public issue.
