# Launch channel package

Rules were checked on 2026-07-28 using the official sources linked below. Recheck the live rules on the publication day. A changed or ambiguous rule stops that channel; it does not justify posting elsewhere in bulk.

## Ranked sequence

1. GitHub repository metadata and an optional maintainer Announcement discussion: canonical evidence home.
2. Show HN: best first external launch when the repository and demo are immediately usable.
3. DEV Community `#showdev`: a technical case study after early questions improve the explanation.
4. The current `r/devops` Weekly Self Promotion Thread only: one disclosed reply, never a blind standalone launch post.
5. Hashnode: optional later tutorial with independent technical value.
6. Lobsters: not in the first batch; only after genuine community participation and ratio eligibility.

Stack Overflow is excluded as a launch channel. Its promotion policy allows disclosed product references only when they directly answer an existing question; pure traffic-driving is spam.

## GitHub repository and Discussions

- Title: `HonestCI public beta: verify the JUnit evidence behind green GitHub Actions`
- Body: use the English main post in `launch/POSTS.md`, followed by the demo commands and current limitations.
- Link: `https://github.com/f0909172434/honest-ci`
- Image: `launch/assets/false-green-before-after.png`
- Timing: first, after the delivery PR is merged and all checks pass. Enabling Discussions is optional and requires maintainer approval.
- Reply template: use the relevant evidence answer from `launch/REPLIES.md`; link to the demo or finding code rather than making a broader claim.
- Human boundary: a maintainer must sign in, recheck repository settings, enable Discussions if desired, choose the Announcement category, and press the final save/post controls. AI must not handle 2FA or passkeys.
- Rules: [GitHub Topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics), [Discussion categories](https://docs.github.com/en/discussions/managing-discussions-for-your-community/managing-categories-for-discussions), [social preview](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview).

Topics candidate set: `github-actions`, `junit`, `ci`, `testing`, `devops`, `typescript`, `nodejs`, `false-green`, `test-evidence`. GitHub permits at most 20 topics; topics must use lowercase letters, numbers, and hyphens and be at most 50 characters.

## Show HN

- Title: `Show HN: HonestCI – Catch green CI runs where expected tests never ran`
- Body: submit the repository URL. Post the Show HN first-comment draft from `launch/POSTS.md` immediately after submission.
- Link: `https://github.com/f0909172434/honest-ci`
- Image: no native launch image is assumed; the repository social preview and README image carry the visual.
- Timing: no official preferred hour exists. As an inference, choose a weekday block when the maintainer can answer for several hours. Do not coordinate votes or comments.
- Reply template: acknowledge the concrete case, request sanitized workflow/JUnit evidence, reproduce it, then classify it as proof, heuristic, false positive, or open question.
- Human boundary: account creation/login, CAPTCHA or other verification, final submit, and all public replies require the maintainer.
- Rules: [Show HN](https://news.ycombinator.com/showhn.html), [HN guidelines](https://news.ycombinator.com/newsguidelines.html), [HN FAQ](https://news.ycombinator.com/newsfaq.html), [submission page](https://news.ycombinator.com/submit).

Show HN requires something the author made that people can actually try, an author present in the discussion, and a title beginning with `Show HN`. It rejects signup-only or landing-page-only launches and expects self-promotion to be occasional.

## DEV Community #showdev

- Title: `HonestCI: reproducing a green GitHub Actions run with zero JUnit tests`
- Body: use the DEV case-study draft in `launch/POSTS.md`; include the two demo commands and explain why static workflow patterns remain warnings.
- Link: `https://github.com/f0909172434/honest-ci`
- Image: `launch/assets/false-green-before-after.png`
- Timing: after the repository launch and preferably after first technical questions. No official preferred hour is published.
- Reply template: use `launch/REPLIES.md`, adding code or a reproducible fixture when the question is technical.
- Human boundary: login, current editor/tag validation, preview review, and final Publish require the maintainer.
- Rule: [official #showdev tag guidance](https://dev.to/t/showdev). The tag is for showing projects and launches; keep the article community-oriented, specific, and non-salesy.

## Reddit r/devops weekly thread

- Title: no separate post. Reply only in the current `Weekly Self Promotion Thread`.
- Body: use the disclosed Reddit reply in `launch/POSTS.md`.
- Link: one direct repository/demo link, `https://github.com/f0909172434/honest-ci`.
- Image: none unless the live thread and subreddit rules explicitly allow and benefit from it.
- Timing: once in the newly opened weekly thread. Reopen the current thread and sidebar rules immediately before posting.
- Reply template: disclose maintainer status, ask for a sanitized reproduction, and never argue from stars, downloads, or unnamed users.
- Human boundary: live rule check, account login, CAPTCHA/2FA, and the final comment are human-only.
- Rules: [current weekly-thread pattern](https://www.reddit.com/r/devops/comments/1v1dk0c/weekly_self_promotion_thread/), [Reddit posting guidance](https://support.reddithelp.com/hc/en-us/articles/360060422572-How-do-I-post-and-comment-on-Reddit), [account requirement](https://support.reddithelp.com/hc/en-us/articles/360060420092-How-do-I-sign-up-for-a-Reddit-account).

## Later or excluded channels

- Lobsters: its [official guidelines](https://lobste.rs/about) require self-promotion to remain below one quarter of a member's stories and comments, use invitations, and discourage launch-only participation. Do not include it in the initial batch.
- Hashnode: a later, independently useful tutorial is possible, but its [Terms](https://hashnode.com/terms) prohibit spam and manipulative bulk/automated content and require human review of AI assistance.
- Stack Overflow: do not launch there; follow its [promotion policy](https://stackoverflow.com/help/promotion) only when a disclosed HonestCI reference is directly relevant to a complete answer.
