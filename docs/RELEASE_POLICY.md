# HonestCI release policy

HonestCI 1.x preserves stable finding meanings, exit codes, CLI JSON fields, Action inputs and outputs, and Evidence Bundle v1 required fields. Additive optional fields and new finding codes are allowed; breaking changes require a new major or bundle schema version.

## Hard gates

Release candidates and stable releases require unit, contract, security, demo, package-smoke, cross-platform Action, reproducible bundle, clean-install, and runtime dependency-audit gates. The false-green demo must fail for the intended reason and the healthy demo must have no hard false positive.

The default branch is changed through pull requests and a stable `ci-gate`.
Release workflows pin third-party Actions to full commit SHAs. Protected
semantic-version tags must not be moved or deleted; the compatible `v1` tag may
move only through the reviewed release process.

Before a Marketplace release, code scanning and dependency review must have no
unresolved Critical or High finding. A contextual security scan is supporting
review evidence only when its recorded coverage is complete; Medium and Low
findings still require an explicit disposition. Raw security reports remain
private because they can contain vulnerable source excerpts.

Stable 1.0 additionally requires the RC npm package and Action to pass fresh installs on Ubuntu, Windows, and macOS with Node.js 20 and 24, and the produced bundle to import successfully into the matching RigorGraph RC.

External use is evidence, not permission. No fixed tester count blocks development or release. HonestCI has no telemetry.

Publishing to npm, GitHub Releases, or GitHub Marketplace requires explicit
maintainer approval after automated gates pass. Marketplace terms and the final
publication action are human-controlled.
