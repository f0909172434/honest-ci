# Finding codes

Finding codes are the stable machine-facing interface. Human messages may improve without changing the meaning of a code.

| Code | Level | Meaning |
| --- | --- | --- |
| HCI001_MISSING_REPORT | Error | A required report glob matched no files. |
| HCI002_INVALID_REPORT | Error | A report is malformed, unsupported, or unsafe XML. |
| HCI003_STALE_REPORT | Error | A wrapped command did not create or change a matched report. |
| HCI004_ZERO_TESTS | Error | A report contains zero tests. |
| HCI005_BELOW_MINIMUM | Error | The test count is below `min_tests`. |
| HCI006_TEST_FAILURES | Error | JUnit reports one or more failures. |
| HCI007_TEST_ERRORS | Error | JUnit reports one or more errors. |
| HCI008_BASELINE_DROP | Error | Test count dropped beyond `max_drop_percent`. |
| HCI009_SKIPPED_LIMIT | Error | Skipped percentage exceeded its configured maximum. |
| HCI010_COMMAND_FAILED | Error | The wrapped test command returned nonzero. |
| HCI101_BASELINE_MISSING | Warning | No trusted baseline exists yet. |
| HCI102_CONTINUE_ON_ERROR | Warning | A test-like job or step permits failure. |
| HCI103_SWALLOWED_EXIT_CODE | Warning | A command appears to force a successful exit. |
| HCI104_PASS_WITH_NO_TESTS | Warning | Jest or Vitest may pass with no tests. |
| HCI105_DYNAMIC_CONDITION | Warning | A dynamic condition may skip required tests. |
| HCI106_BASELINE_UNAVAILABLE | Warning | The base-commit baseline could not be read. |
| HCI107_FRESHNESS_UNVERIFIED | Warning | Standalone `check` cannot prove report freshness. |
| HCI200_INPUT_ERROR | Input error | Configuration or command input could not be evaluated. |

Exit code 0 means no definite problem was found. Exit code 1 means at least one error finding. Exit code 2 means configuration or input could not be evaluated.
