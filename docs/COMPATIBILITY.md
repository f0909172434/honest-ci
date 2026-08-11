# Compatibility and known limitations

HonestCI 1.x has one required report format: JUnit XML. The language and test
framework that produced the XML do not otherwise matter, but not every file
called “JUnit” has identical structure. This page separates continuously
verified behavior from copyable recipes and community reports.

## Continuously verified

The repository CI exercises the source Action on GitHub-hosted Ubuntu, Windows,
and macOS runners with Node.js 20 and 24. It also builds and installs a packed
npm tarball in a clean temporary project.

The parser tests cover:

- counters on `<testsuite>` and `<testsuites>`;
- explicit `<testcase>` elements with failures, errors, and skips;
- nested and XML-namespaced suites;
- multiple report files and overlapping-glob deduplication; and
- rejection of malformed XML, DTDs, and entity declarations.

The scenario matrix additionally reproduces missing, zero-test, stale,
test-count-drop, failing-test, and nested report-discovery outcomes. Run it with
`npm run demo:scenarios` from a source checkout.

## Documented integration recipes

[Runner recipes](RUNNER_RECIPES.md) are provided for Vitest, Jest with
`jest-junit`, pytest, and Maven Surefire. They are copyable starting points, not
a claim that every version, plugin, monorepo layout, or custom formatter is
continuously tested.

If a producer emits JUnit-compatible XML, HonestCI can usually inspect it. A
public compatibility report is still valuable because the producer version,
XML shape, path layout, and runner operating system can expose edge cases.

## Supported boundaries

| Area | HonestCI 1.x boundary |
| --- | --- |
| GitHub integration | GitHub Actions JavaScript Action |
| CLI runtime | Node.js 20 or newer |
| Verified hosted runners | Ubuntu, Windows, macOS |
| Report input | JUnit XML files selected by workspace-relative globs |
| Multiple files | Aggregated per named report; duplicate matches are counted once |
| Pull-request baseline | Read from the base commit when a token with `contents: read` is available |

## Known limitations

- HonestCI does not validate against a universal JUnit XSD; no single schema is
  consistently used by every producer.
- Report-level counters are used when no testcase elements are available.
  Inconsistent producer counters cannot be independently reconstructed.
- Standalone `check` cannot prove which process created an existing report and
  emits `HCI107_FRESHNESS_UNVERIFIED`; use `run` or the Action with `command`
  when freshness matters.
- Static workflow findings are heuristics and remain warnings. HonestCI does
  not execute workflow YAML or prove that every required job ran.
- GitLab CI, CircleCI configuration, Azure Pipelines, TRX, native NUnit XML,
  coverage data, flaky-test analytics, and hosted dashboards are outside 1.x.
- HonestCI does not prove assertion quality, test completeness, runner
  authenticity, or software correctness.

Use the [compatibility report issue form](../.github/ISSUE_TEMPLATE/compatibility.yml)
for a sanitized success or failure report. Use the [possible false-positive
form](../.github/ISSUE_TEMPLATE/false-positive.yml) when a definite finding
blocked a run that was healthy.
