# HonestCI 1.0.1

HonestCI 1.0.1 adds a verified baseline-refresh path. `baseline write -- <test-command>` snapshots configured JUnit reports, runs the test command without shell interpolation, and writes the committed baseline only when the command succeeds and the reports are fresh. The existing no-command workflow remains compatible and emits `HCI107_FRESHNESS_UNVERIFIED`.

This patch also enforces canonical workspace boundaries for configuration, workflow, report, and baseline paths; uses exclusive temporary baseline files and atomic replacement; and adds linked-directory and Windows junction regressions.

The release adds a stable cross-platform CI gate, CodeQL, Dependabot coverage, immutable workflow Action pins, a canonical security policy, and an explicit threat model. It preserves stable finding meanings, exit codes, CLI JSON, GitHub Action inputs and outputs, configuration semantics, and Evidence Bundle v1 required fields. The package is validated on Node.js 20 and 24.
