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

## Optional regional lane

Regional drafts and rules are in `launch/LOCALIZED_CHANNELS.md`. A regional approval must select channels explicitly; it is not permission to publish to every listed platform.

Traditional Chinese — select at most one initial public channel:

- [ ] DevOps Taiwan Facebook group: first approve the private administrator inquiry; public posting remains conditional on an affirmative admin reply and live group rules.
- [ ] Dcard 軟體工程師板: complete case-study draft only, conditional on the current pinned board rules allowing the post and link.
- [ ] Threads: three-post Traditional Chinese thread from the maintainer profile; use a community only if a relevant one exists and its live rules permit it.
- [ ] X: three-post Traditional Chinese thread from the maintainer profile; no unsolicited duplicate replies.

Simplified Chinese — select at most one initial public channel:

- [ ] V2EX `分享创造`: complete maintainer-disclosed project and reproduction post.
- [ ] SegmentFault: complete technical article, scheduled after V2EX feedback and not on the same day.
- [ ] X or Threads: one Simplified Chinese short thread from an account with a legitimate technical audience.

After the selected regional post receives replies, review them before approving another regional channel. 掘金, unverified Facebook/X/Threads groups, general Dcard boards, Hashnode, and Lobsters are not included.

No npm, Marketplace, new Release, tag movement, automated reply, unlisted group, or mass-posting action is included.

## Approval statement for the maintainer

Approve only after filling the PR URL, merged commit, current check run, exact dates/times, and posting accounts:

- Delivery PR: `TBD`
- Merged commit: `TBD`
- Required check run: `TBD`
- Posting accounts and existing community memberships: `TBD by maintainer`
- Scheduled times: `TBD by maintainer`
- Selected Traditional Chinese channel: `TBD by maintainer, at most one initially`
- Selected Simplified Chinese channel: `TBD by maintainer, at most one initially`

Proposed approval: “I approve the five core actions above plus the explicitly checked regional channels, subject to same-day rules and stated admin conditions. I do not approve npm publication, Marketplace submission, a new GitHub Release, tag changes, automated public replies, 2FA/account handling, unlisted groups, or any other post.”
