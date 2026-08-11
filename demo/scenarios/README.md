# Reproducible scenario matrix

Run seven isolated scenarios from a source checkout:

```console
npm ci
npm run demo:scenarios
```

The command builds HonestCI, creates a temporary workspace for each scenario,
runs the real bundled CLI, checks the exit status and stable finding code, and
then removes the temporary files. It does not need a GitHub token or network
access after `npm ci`.

| Scenario | Ordinary command result | Expected HonestCI result |
| --- | --- | --- |
| Tests silently do not run | exits 0 and creates no report | `HCI001_MISSING_REPORT` |
| Zero tests | exits 0 with JUnit `tests="0"` | `HCI004_ZERO_TESTS` |
| Misconfigured report path | exits 0 and writes a different path | `HCI001_MISSING_REPORT` |
| Stale report | exits 0 without changing an old report | `HCI003_STALE_REPORT` |
| Unexpected test-count drop | exits 0 with 7 tests against a baseline of 10 | `HCI008_BASELINE_DROP` |
| Failing tests | exits 0 but JUnit records one failure | `HCI006_TEST_FAILURES` |
| Overlapping discovery globs | one nested report matches two globs | passes and counts the file once |

These fixtures demonstrate the listed observable conditions only. They do not
prove that HonestCI detects every CI defect, that a test suite is sufficient,
or that assertions are meaningful. See the complete [finding-code
reference](../../docs/FINDINGS.md).
