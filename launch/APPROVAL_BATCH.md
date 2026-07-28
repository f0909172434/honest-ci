# Proposed one-time launch approval batch

Status: not approved. Preparing this file does not authorize publication.

## Evidence gate

- Product increment: release-asset CLI onboarding, full Action commit pins, package install smoke, and executable before/after demo.
- Required check: delivery PR CI green on Ubuntu, Windows, and macOS for Node.js 20 and 24, plus package job.
- Demo assertion: ordinary runner exit 0; HonestCI exit 1 with `HCI004_ZERO_TESTS`.
- Image: `launch/assets/false-green-before-after.png`, SHA-256 `302900d1c76fd8e2a57538e14feb85c5ab32a58e39442935952e72ca80eca92b`.
- Release status: existing GitHub prerelease `v0.1.0-beta.1`; npm registry package not published; no new release authorized.

## Batch proposed for one approval

| Order | Channel/action | Exact draft | Link | Image | Proposed timing | Human requirement |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | GitHub topics and social preview | topics in `CHANNELS.md`; no public usage claims | repository | before/after PNG | immediately after approval | login, settings review, final Save |
| 2 | Optional GitHub Announcement discussion | English main post | repository | before/after PNG | same day | enable Discussions if desired, final Post |
| 3 | Show HN | channel title + first comment | repository | repository preview | a weekday block with several hours available | rule recheck, login/CAPTCHA, Submit |
| 4 | DEV `#showdev` | DEV case-study draft | repository | before/after PNG | after initial technical questions | preview and Publish |
| 5 | Current `r/devops` weekly thread | disclosed Reddit reply | repository | none | once in the then-current weekly thread | live rule check and final Comment |

Hashnode and Lobsters are not included. No npm, Marketplace, new Release, tag movement, automated reply, or additional mass-posting action is included.

## Approval statement for the maintainer

Approve only after filling the PR URL, merged commit, current check run, exact dates/times, and posting accounts:

- Delivery PR: `TBD`
- Merged commit: `TBD`
- Required check run: `TBD`
- Posting accounts: `TBD by maintainer`
- Scheduled times: `TBD by maintainer`

Proposed approval: “I approve the exact five-action batch above after the same-day rule checks. I do not approve npm publication, Marketplace submission, a new GitHub Release, tag changes, automated public replies, 2FA/account handling, or any unlisted post.”
