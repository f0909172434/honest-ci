# Launch drafts

These are drafts only. Do not post without human approval. They intentionally avoid Markdown bold markers.

## Show HN

Title: Show HN: HonestCI – Catch green CI runs where expected tests never ran

I built HonestCI after seeing a recurring failure mode in GitHub Actions: the workflow is green, but the expected tests did not actually produce fresh evidence.

HonestCI wraps a test command, requires new or changed JUnit XML, checks zero tests and failures, and compares test counts with a trusted baseline from the pull request base commit. It also warns about continue-on-error, swallowed exit codes, passWithNoTests, and conditions that may skip tests.

It is local, open source, MIT licensed, and has no service, telemetry, AI API, or PR comment permission. The first beta supports GitHub Actions and JUnit XML on Linux, Windows, and macOS.

I would especially value real false-green examples and reports of hard false positives.

Repository: https://github.com/f0909172434/honest-ci

## DEV #showdev

Title: HonestCI: make green CI mean the expected tests actually ran

A passing workflow can hide a failed command, a stale report, zero tests, or an unexpected drop in the test suite.

HonestCI adds a small verification layer around GitHub Actions. It checks fresh JUnit evidence, test counts, failures, errors, skipped thresholds, and a base-branch baseline. Ambiguous workflow patterns stay warnings; observable report problems fail the job.

The beta is TypeScript, runs locally, supports Node.js 20+, and needs only contents: read. There is no hosted account or telemetry.

Try the reproducible demo and tell me which CI edge case I missed:
https://github.com/f0909172434/honest-ci

Tags: #showdev #githubactions #testing #opensource

## Reddit r/devops promotional thread

Title: I made an open-source check for false-green GitHub Actions runs

I am testing HonestCI, a small open-source CLI and GitHub Action that checks whether the expected test command actually produced fresh JUnit evidence.

It fails on missing, malformed, stale, or zero-test reports; command failures; JUnit failures/errors; and configurable test-count drops. It only warns on patterns such as continue-on-error or || true because static analysis alone cannot prove the run was wrong.

The beta has no SaaS, telemetry, AI API, or PR-comment permission. I am looking for real false-green workflows and hard false positives before expanding beyond JUnit and GitHub Actions.

Repository and demo: https://github.com/f0909172434/honest-ci
