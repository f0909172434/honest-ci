# Evidence-oriented reply playbook

These are drafts. A maintainer must review the live question and approve every public reply. Never answer a concrete report without checking its sanitized evidence.

## “Does workflow lint prove my CI run was wrong?”

No. HonestCI treats `continue-on-error`, swallowed exit codes, `--passWithNoTests`, and dynamic test conditions as warnings because static YAML alone cannot prove what happened in a particular run. Hard failures require observable evidence such as a missing, malformed, unchanged, zero-test, failed, or errored JUnit report, a nonzero wrapped command, or a configured count threshold being crossed.

## “Does this prove my tests are good or my program is correct?”

No. HonestCI verifies only observable CI execution evidence. It does not establish that tests are sufficient, assertions are meaningful, every desired test exists, coverage is adequate, or the program is correct.

## “How do you decide a report is stale?”

For `run` and the Action command mode, HonestCI snapshots every matched report before the test command and compares the resulting file signature afterward. A matched file that was not created or changed is `HCI003_STALE_REPORT`. Standalone `check` cannot prove freshness and emits `HCI107_FRESHNESS_UNVERIFIED` instead of upgrading uncertainty into a hard failure.

## “Can a pull request edit its baseline to hide a drop?”

On pull-request runs, the Action reads the configured baseline path from the pull request base commit through the GitHub API. It does not trust a workspace baseline edited by that pull request. If the baseline cannot be read, fixed minimum checks remain active and HonestCI emits `HCI106_BASELINE_UNAVAILABLE`; it does not pretend the comparison succeeded.

## “Why only JUnit XML and GitHub Actions?”

The beta keeps one evidence format and one CI environment small enough to test across Ubuntu, Windows, and macOS. GitLab, CircleCI, TRX, coverage analysis, SaaS, AI APIs, and automatic PR comments are intentionally out of scope. Expansion should follow verified false positives, false negatives, and onboarding evidence rather than launch activity.

## “Why not just fail on continue-on-error?”

Because it can be intentional and safe in context. HonestCI warns so the pattern is visible, but does not claim it caused missing tests without report or command evidence. This separation is part of the stable finding-code contract.

## “Is the npm package published?”

No. The npm registry package is not published. The current beta CLI is installed from the versioned `.tgz` attached to the existing GitHub prerelease, and the Action examples pin the prerelease commit SHA. Do not describe this as an npm registry release.

## Intake for a possible false positive or false green

Please share a minimal sanitized workflow excerpt, `honest-ci.yml`, the relevant JUnit structure, operating system, Node version, HonestCI version or commit, exact finding code, and expected versus observed exit status. Remove tokens, private URLs, environment values, test data, and proprietary logs. We will first reproduce, then label the result as verified behavior, hard false positive, heuristic warning, documentation gap, or unresolved.
