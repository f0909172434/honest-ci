# Traditional and Simplified Chinese launch channels

Rules and public community pages were checked on 2026-07-28. This document adds regional options to `launch/CHANNELS.md`; it does not authorize joining a community or publishing. Reopen the live rules from the intended account on the publication day.

## Recommended order

1. Traditional Chinese: ask DevOps Taiwan Facebook group administrators whether the technical demo is welcome; publish only after an affirmative answer.
2. Simplified Chinese: publish one complete technical project post to V2EX `分享创造`.
3. Traditional Chinese: publish a complete, non-commercial case study to Dcard 軟體工程師板 only if the then-current board rules still allow it.
4. Traditional or Simplified Chinese: use one localized X or Threads thread from the maintainer's own account; do not duplicate it into unsolicited replies.
5. Simplified Chinese: consider SegmentFault only as a standalone technical article, not as a repository link drop.

Do not publish all five in one day. Start with one regional channel, answer questions, and correct the explanation before the next channel.

## Traditional Chinese

### DevOps Taiwan Facebook group

- Fit: high. The community's own site describes a space for DevOps practitioners, links its Facebook group, welcomes experience sharing, and asks people to contact the community through Facebook.
- Permission status: unknown. The public site does not expose the Facebook group's current self-promotion rules without an authenticated Facebook session. Treat admin permission as required.
- Title after permission: `同一個測試 runner exit 0，為什麼 CI 不該直接顯示綠燈？`
- Body: use `繁體中文 Facebook／DevOps Taiwan 社團草稿` from `launch/POSTS.md`.
- Link: `https://github.com/f0909172434/honest-ci`
- Image: `launch/assets/false-green-before-after.png`
- Timing: after an administrator explicitly approves the topic and posting format; choose a time when the maintainer can answer technical questions.
- Reply approach: reproduce concrete cases, distinguish hard report evidence from workflow warnings, and never answer from stars or unnamed users.
- Human-only steps: Facebook login, group membership or participation questions, reading current group rules, messaging admins, final post approval, and all replies.
- Sources: [DevOps Taiwan Community](https://devopstw.club/), [Facebook group rules](https://www.facebook.com/help/462230500886400/), [Facebook group post approval](https://www.facebook.com/help/messenger-app/232426073439303/).

No other Facebook engineering group is approved in this package. A group name or topical match is not evidence that self-promotion is allowed. Add a group only after recording its URL, live rules, admin response, and intended post in the approval batch.

### Dcard 軟體工程師板

- Fit: medium. The board has historically framed itself around open-source community culture and requires category and topic labels, but the live board rules must be rechecked because the accessible rule posts are older.
- Risk: Dcard prohibits unapproved advertising, brand promotion, incomplete teaser posts, repeated posting, and content that redirects readers to an external site for the substance. A complete open-source technical case study may fit, but a launch announcement or repository-only link is too risky.
- Title: `#分享 #GitHubActions 一個 exit 0 但 JUnit 測試數是 0 的假綠燈案例`
- Body: use the Dcard draft in `launch/POSTS.md`; keep the reproduction, result, limitations, and disclosure inside the Dcard article.
- Link: one repository link at the end, only if the live rules permit it and the linked page covers the same topic as the article.
- Image: before/after PNG, subject to the current board media rules.
- Timing: not in the first launch wave. Publish only after the maintainer account can read the current pinned rules and confirms the post is not classified as commercial promotion.
- Reply approach: answer inside Dcard; do not ask readers to DM, register, follow, like, or move elsewhere.
- Human-only steps: login, current board-rule check, category/topic selection, preview, final post, and moderation response.
- Sources: [Dcard current site rules](https://support.dcard.in/hc/zh-tw/articles/16006429198735-Dcard-%E7%A4%BE%E7%BE%A4%E5%AE%88%E5%89%87%E8%88%87%E8%A6%8F%E7%AF%84-%E7%AB%99%E8%A6%8F), [software engineer board rules](https://www.dcard.tw/f/softwareengineer/p/231073511), [board direction and categories](https://www.dcard.tw/f/softwareengineer/p/242475219).

### Traditional Chinese Threads

- Fit: medium for awareness and replies, lower for deep technical explanation.
- Format: use the three-post Traditional Chinese Threads draft in `launch/POSTS.md`, with the image on the first post and the repository link in the last post.
- Link and media: Meta documents links, photos, and video in Threads posts. Recheck the composer limits before posting.
- Communities: Threads now has public topic communities, but Meta says not every interest has one. No DevOps, testing, or software-development community has been verified for this package. Search inside the logged-in product on publication day; otherwise post from the maintainer's profile using a relevant topic tag.
- Timing: after one evidence-rich technical post exists as the destination; do not paste the same promotion into unrelated replies.
- Reply approach: one concise evidence answer, then link the exact demo or finding documentation when needed.
- Human-only steps: Instagram/Threads login, live topic/community discovery, community-rule review if one exists, final post, and replies.
- Sources: [Threads post capabilities](https://about.fb.com/news/2023/07/introducing-threads-new-app-text-sharing/), [Threads Communities](https://about.fb.com/news/2025/10/introducing-threads-communities-find-your-people/), [Instagram/Threads community guidelines](https://www.facebook.com/help/instagram/477434105621119).

### Traditional Chinese X

- Fit: medium. Use a short technical thread from the maintainer's own account rather than unsolicited replies.
- Format: use the Traditional Chinese X draft in `launch/POSTS.md`; attach the before/after PNG to the first post and put the repository link in the final post.
- Limits: standard posts are currently up to 280 characters; links consume the platform's shortened-link allocation, and posts can contain media. Recheck the composer before posting.
- Communities: community rules are moderator-defined and can prohibit links, images, advertising, or self-promotion. No specific Traditional Chinese developer community is approved here; only add one after reading its live rules.
- Timing: post once when the maintainer can answer replies. Do not mention multiple accounts, mass-reply, or repeat the same link into conversations.
- Human-only steps: login, community membership/rule acceptance if applicable, final post, and replies.
- Sources: [X posting limits and media](https://help.x.com/en/using-x/how-to-post), [posting links](https://help.x.com/en/using-x/how-to-post-a-link), [X Communities](https://help.x.com/en/using-x/communities), [community moderator/rule guidance](https://help.x.com/en/using-x/communities-moderator-playbook), [spam behavior guidance](https://help.x.com/en/rules-and-policies/x-rules-and-best-practices).

## Simplified Chinese

### V2EX 分享创造

- Fit: high. V2EX's official node guidance explicitly welcomes independent developers publishing new work in `分享创造` and separates that from company marketing in `推广`.
- Classification rule: use `分享创造` only while the post is a maintainer-built open-source project seeking technical feedback. If the post becomes marketing copy or represents a commercial campaign, use `推广` or do not post.
- Title: `分享一个检查 GitHub Actions 假绿灯的开源工具：HonestCI`
- Body: use the V2EX draft in `launch/POSTS.md`, including reproduction commands, current beta scope, known limits, and maintainer disclosure.
- Link: one direct repository link.
- Image: optional; the text reproduction must stand on its own.
- Timing: first Simplified Chinese channel, after the delivery PR and current CI evidence are stable. Remain available for technical replies.
- Reply approach: answer specific implementation questions, invite sanitized false-positive fixtures, and do not ask for upvotes.
- Human-only steps: account login, node selection, current site-rule check, final topic creation, and replies.
- Source: [V2EX official node guidance](https://www.v2ex.com/help/node).

### SegmentFault

- Fit: medium only for an original, complete technical article. It is not suitable for a short launch announcement.
- Risk: SegmentFault's current community rules prohibit repeated promotion, deceptive links, SEO-oriented link volume, fabricated experience, and other spam advertising behavior.
- Title: `从 exit 0 到可观察证据：复现一次 GitHub Actions 假绿灯`
- Body: use the SegmentFault draft in `launch/POSTS.md`; include the full reproduction and why heuristics remain warnings.
- Link: one disclosed repository/source link at the end. Do not republish the same promotional text across questions or tags.
- Image: before/after PNG if the current article editor permits it.
- Timing: after V2EX feedback improves the technical explanation; not on the same day.
- Reply approach: keep answers complete on-platform and do not redirect unrelated questions to HonestCI.
- Human-only steps: login, article/editor rules check, license choice, preview, final publication, and replies.
- Sources: [SegmentFault community management rules](https://segmentfault.com/tos/community), [service agreement](https://segmentfault.com/tos), [help center](https://segmentfault.com/help).

### Simplified Chinese X or Threads

- Fit: optional, after the V2EX or SegmentFault post provides a deeper destination.
- Format: use the Simplified Chinese short thread in `launch/POSTS.md` once on the platform where the maintainer already has a legitimate technical audience.
- Community selection: no Chinese DevOps community is pre-approved. Apply the same X or Threads live-rule checks described above.
- Anti-spam boundary: do not cross-post identical replies, mass-mention accounts, or manufacture engagement.

## Considered but not approved

- 掘金: technically relevant, but an official current self-promotion rule suitable for this exact launch was not confirmed in this review. Revisit only as a full technical article after locating the live editorial rules.
- General Facebook software-engineer, jobs, outsourcing, startup, or freelancer groups: audience overlap is insufficient, and public rules were unavailable or oriented to jobs/sales rather than CI evidence.
- Dcard general boards: less relevant than 軟體工程師板 and more likely to treat the post as promotion.
- Unverified X or Threads communities: a community appearing in search is not approval to promote there.
