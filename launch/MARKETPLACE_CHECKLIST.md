# GitHub Marketplace release checklist

This checklist prepares HonestCI for listing without performing the final
Marketplace submission. The maintainer remains responsible for accepting the
Marketplace terms and selecting **Publish**.

## Automated prerequisites

- [ ] The release commit is on `main` and the required `ci-gate` passed.
- [ ] Code scanning, dependency review, and secret scanning have no unresolved
      Critical or High finding.
- [ ] The private Codex Security review completed with complete coverage; all
      Medium and Low findings have a recorded disposition.
- [ ] `npm run verify`, package smoke, and the public registry smoke pass.
- [ ] The immutable release tag and moving `v1` tag resolve to the intended
      reviewed commits.
- [ ] `action.yml` retains the stable inputs/outputs, Node runtime, author,
      description, and branding.

## Listing copy

- **Name:** HonestCI
- **Tagline:** Make green CI mean the tests you expected actually ran.
- **Primary category:** Continuous integration
- **Secondary category:** Code quality
- **Support:** GitHub Issues for sanitized defects and Private Vulnerability
  Reporting for security reports

Use the README's reproducible before/after image and five-minute Action example.
Do not claim that HonestCI proves test quality, software correctness, or the
absence of vulnerabilities.

## Human-controlled publication

1. Open the repository's Marketplace draft from the latest reviewed release.
2. Verify the listing preview and links.
3. Review and accept the Marketplace terms.
4. Publish the listing.
5. Install the listed Action into a disposable public test repository and
   verify that it resolves the intended immutable release.

If the listing resolves the wrong tag, a security gate is incomplete, or the
fresh-install smoke fails, stop publication rather than weakening a gate.
