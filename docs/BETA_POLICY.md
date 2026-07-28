# Beta release policy for a solo maintainer

HonestCI does not wait for a fixed panel of testers before each beta. External use is evidence, not permission to keep developing or releasing.

## Hard gates before a beta

A beta may ship when all of these are true:

- Unit, contract, security, and end-to-end tests pass.
- The real GitHub Action passes on Ubuntu, Windows, and macOS with Node.js 20 and the current LTS.
- The bundled Action and CLI are reproducibly built from the tagged commit.
- A packed tarball installs and runs from a clean directory.
- Runtime dependency audit has no known vulnerability.
- The false-green demo fails for the intended reason and the healthy demo has no hard false positive.
- The English, Traditional Chinese, Simplified Chinese, and Japanese Quick Starts agree on the install reference and product limits.

If one of these gates fails, fix it before release. A missing external tester does not fail a gate.

## Post-release evidence

Collect evidence asynchronously from public issues, pull requests, opt-in reports, and observable public integrations. HonestCI has no telemetry.

Useful signals include:

- Distinct external repositories that install the Action.
- Real false-green findings that HonestCI prevented.
- Hard false positives that blocked a healthy run.
- Time from opening the README to the first useful Job Summary.
- Documentation or configuration steps where users stopped.

Five external users completing the flow is a useful milestone, not a prerequisite. It should never leave the project waiting indefinitely.

## Decision rules

- Ship small beta fixes whenever the hard gates pass.
- Do not add another report format only to create activity; prioritize onboarding and false-positive reduction first.
- If fewer than five external repositories adopt HonestCI in 30 days, improve positioning, recipes, and installation before expanding scope.
- Require separate human approval for npm publication, Marketplace agreements, credentials, and public promotional posts.
