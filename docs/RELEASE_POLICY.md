# HonestCI release policy

HonestCI 1.x preserves stable finding meanings, exit codes, CLI JSON fields, Action inputs and outputs, and Evidence Bundle v1 required fields. Additive optional fields and new finding codes are allowed; breaking changes require a new major or bundle schema version.

## Hard gates

Release candidates and stable releases require unit, contract, security, demo, package-smoke, cross-platform Action, reproducible bundle, clean-install, and runtime dependency-audit gates. The false-green demo must fail for the intended reason and the healthy demo must have no hard false positive.

Stable 1.0 additionally requires the RC npm package and Action to pass fresh installs on Ubuntu, Windows, and macOS with Node.js 20 and 24, and the produced bundle to import successfully into the matching RigorGraph RC.

External use is evidence, not permission. No fixed tester count blocks development or release. HonestCI has no telemetry.

Publishing to npm or GitHub Releases requires explicit maintainer approval after automated gates pass.
