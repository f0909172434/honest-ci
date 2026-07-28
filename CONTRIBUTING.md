# Contributing

Issues and focused pull requests are welcome. Before opening a change:

1. Run `npm ci`.
2. Run `npm run verify`.
3. If behavior changes, add a fixture or test that proves the old and new outcomes.
4. Keep definite failures separate from heuristic warnings.
5. Do not change an existing finding code to mean something different.

New report formats are intentionally outside the first beta. Real false-green examples and false-positive reports are especially useful.
