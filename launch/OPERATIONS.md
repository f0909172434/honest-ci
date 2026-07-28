# AI-assisted launch operations

This checklist prepares work; it does not authorize public actions.

## AI may prepare without publishing

- Re-run `npm run verify`, `npm audit --omit=dev`, and the documented demo.
- Recalculate asset hashes and verify that screenshots match actual output.
- Fetch public repository, PR, issue, check, star, and contributor state for a dated evidence snapshot.
- Recheck official platform rules and flag changes.
- Fill channel drafts, image references, candidate times, and source links.
- Draft replies that cite repository evidence and classify certainty.
- Monitor already-public threads only after a human authorizes the specific monitoring scope; summarize new replies without posting.
- Prepare a proposed response queue with `reply`, `needs reproduction`, `possible false positive`, `scope request`, or `moderation risk` labels.

## Human-only steps

- Final approval of the exact launch batch, wording, channels, images, and schedule.
- Account login, account creation, 2FA, passkeys, CAPTCHA, invitations, agreements, or community eligibility decisions.
- Rechecking live subreddit, Dcard board, Facebook/X/Threads community, V2EX node, and article-platform rules and deciding whether self-promotion is permitted that day.
- Contacting community administrators, answering membership questions, and interpreting an administrator's permission or conditions.
- Enabling GitHub Discussions, changing repository social preview or topics, and pressing any public post/reply control.
- Publishing npm packages, Marketplace listings, GitHub Releases, moving tags, or public community posts.
- Disclosing private adoption or support evidence.

## Preflight for each proposed post

- [ ] Delivery PR merged; required checks are green on the merged commit.
- [ ] Current release/install status matches every sentence.
- [ ] `npm run demo:verify` passes and the image digest matches `launch/ASSET_MANIFEST.md`.
- [ ] No user, star, install, download, testimonial, or finding count is asserted without dated evidence.
- [ ] Official channel rules were reopened that day.
- [ ] For a Facebook/X/Threads community or other managed group, the exact group URL and current rules are recorded; administrator permission is attached when required.
- [ ] The selected localized draft matches the account language and is complete on-platform rather than a teaser that redirects readers.
- [ ] The post contains no Markdown `**` markers.
- [ ] The maintainer can stay available for early replies.
- [ ] Exact text, link, image, time, and account are included in the approval batch.

## Monitoring cadence after an approved post

For the first day, AI may collect public replies at a human-approved cadence and prepare response drafts. The maintainer reviews and sends each reply. After the first day, review once daily for one week, then at the 30- and 90-day measurement points. A moderation request, security report, credential exposure, legal complaint, or possible hard false positive is escalated immediately and is never answered automatically.
