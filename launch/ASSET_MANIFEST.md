# Launch asset manifest

No asset may be published until the launch approval batch is approved.

## Before/after image

- PNG: `launch/assets/false-green-before-after.png`
- Editable source: `launch/assets/false-green-before-after.html`
- Dimensions: 1280 × 640
- Size: 183,259 bytes
- SHA-256: `302900d1c76fd8e2a57538e14feb85c5ab32a58e39442935952e72ca80eca92b`
- Source evidence: the exact output and exit conditions asserted by `npm run demo:verify`
- Intended uses: README first screen, GitHub social preview candidate, DEV article, and link previews
- Allowed claim: the same zero-test runner exits 0 without evidence verification and is blocked with `HCI004_ZERO_TESTS` when wrapped by HonestCI
- Forbidden inference: HonestCI proves test quality, full test coverage, assertion quality, program correctness, or that every lint warning caused a bad run

The HTML source is kept beside the PNG so wording can be reviewed and the PNG can be regenerated. If the demo output, finding code, version, or command changes, regenerate the image, recalculate the digest, rerun `npm run demo:verify`, and update this manifest before approval.

## Optional animation

A GIF or video is not required for the first launch batch. If one is added later, it must show an actual rerun of the two documented commands, remain legible without audio, and receive its own source, dimensions, digest, and evidence boundary here.
