# HonestCI 1.0.0

HonestCI makes green CI mean the expected tests actually ran. It wraps test commands, verifies fresh JUnit evidence, compares test counts against a trusted default-branch baseline, and reports suspicious GitHub Actions patterns while preserving stable exit codes and finding meanings.

The stable release emits additive RigorGraph Evidence Bundle v1 results from `run`, `check`, and the GitHub Action. Passed and failed results preserve configuration, report, baseline, workflow, and allowlisted provenance hashes without including raw JUnit, test names, logs, arbitrary environment variables, or secrets. Invalid configuration, XML, or CLI input still exits 2 without fabricating a bundle.

The public npm package passed fresh installs on Windows, Ubuntu, and macOS with Node.js 20 and 24. Healthy and false-green bundles both imported into RigorGraph without promoting claim status, and tampering with an imported bundle caused the expected hash-audit failure.

HonestCI remains limited to GitHub Actions and JUnit XML. It verifies observable CI execution evidence; it does not prove test sufficiency, runner authenticity, program correctness, or the truth of a linked claim.
