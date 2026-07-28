# Launch drafts

Drafts only. Do not publish without the approval in `launch/APPROVAL_BATCH.md`. These social drafts intentionally contain no Markdown bold markers.

## English main release post

Title: HonestCI public beta: make green CI mean the tests you expected actually ran

A green GitHub Actions job can still hide a missing report, a stale report from an earlier run, zero discovered tests, or an unexpected drop in the observed test count.

HonestCI is an open-source CLI and JavaScript Action that wraps a test command and checks the JUnit XML it actually produced. Definite, observable problems fail the job. Suspicious workflow patterns such as `continue-on-error`, swallowed exit codes, `--passWithNoTests`, and dynamic test conditions stay warnings because static inspection alone cannot prove the run was wrong.

The public beta supports GitHub Actions and JUnit XML on Ubuntu, Windows, and macOS. It is local, MIT licensed, and has no hosted service, telemetry, AI API, coverage analysis, or pull request comment permission. The typical integration needs only `contents: read`.

The reproducible demo runs the same zero-test runner twice. By itself it exits 0; when HonestCI checks the resulting JUnit evidence, the run exits 1 with `HCI004_ZERO_TESTS`.

Repository, five-minute Quick Start, and demo:
https://github.com/f0909172434/honest-ci

I would value sanitized false-green examples, hard false positives, and reports of where the setup stopped being a five-minute task.

HonestCI verifies observable CI execution evidence. It does not prove that tests are sufficient, assertions are meaningful, all desired tests exist, or a program is correct.

## 繁體中文主發布文

標題：HonestCI 公開 beta：讓綠燈 CI 真正代表預期的測試有執行

GitHub Actions 顯示綠燈，不一定代表預期測試真的留下了本次執行的證據。報告可能不存在、沿用舊檔、測試數為零，或觀察到的測試數意外下降。

HonestCI 是開源的 CLI 與純 JavaScript Action。它會包住測試命令，檢查該命令實際產生的 JUnit XML。可由執行證據確定的問題會讓 job 失敗；`continue-on-error`、吞掉 exit code、`--passWithNoTests` 與動態測試條件等靜態模式只會警告，因為單看 workflow 無法證明該次執行有錯。

目前公開 beta 支援 GitHub Actions 與 JUnit XML，可在 Ubuntu、Windows、macOS 使用。它在本機執行、採 MIT 授權，沒有 SaaS、遙測、AI API、coverage 分析或自動 PR 留言；一般整合只需要 `contents: read`。

可重現 demo 會用同一個零測試 runner 執行兩次：單獨執行時 exit 0；由 HonestCI 檢查 JUnit 證據後，會以 `HCI004_ZERO_TESTS` 正確阻擋並 exit 1。

Repository、五分鐘 Quick Start 與 demo：
https://github.com/f0909172434/honest-ci

很歡迎提供已移除敏感資訊的假綠燈案例、hard false positive，以及任何讓安裝超過五分鐘的步驟。

HonestCI 只驗證可觀察的 CI 執行證據；它不證明測試充分、斷言有意義、所有預期測試都存在，或程式正確。

## 简体中文主发布文

标题：HonestCI 公开 beta：让绿色 CI 真正表示预期的测试已运行

GitHub Actions 显示绿色，并不一定表示预期测试真的留下了本次运行的证据。报告可能缺失、沿用旧文件、测试数为零，或者观察到的测试数意外下降。

HonestCI 是开源 CLI 和纯 JavaScript Action。它会包裹测试命令，并检查该命令实际生成的 JUnit XML。可以从运行证据确定的问题会使 job 失败；`continue-on-error`、吞掉 exit code、`--passWithNoTests` 和动态测试条件等静态模式只会警告，因为仅查看 workflow 无法证明本次运行有误。

目前的公开 beta 支持 GitHub Actions 和 JUnit XML，可在 Ubuntu、Windows、macOS 上使用。它在本地运行，采用 MIT 许可证，没有 SaaS、遥测、AI API、coverage 分析或自动 PR 评论；常规集成只需要 `contents: read`。

可复现 demo 会用同一个零测试 runner 运行两次：单独运行时 exit 0；由 HonestCI 检查 JUnit 证据后，会以 `HCI004_ZERO_TESTS` 正确阻止并 exit 1。

Repository、五分钟 Quick Start 和 demo：
https://github.com/f0909172434/honest-ci

欢迎提供已移除敏感信息的假绿灯案例、hard false positive，以及任何让安装超过五分钟的步骤。

HonestCI 只验证可观察的 CI 运行证据；它不证明测试充分、断言有意义、所有预期测试都存在，或程序正确。

## 日本語メインリリース文

タイトル：HonestCI public beta：緑の CI を「期待したテストが実行された」という意味にする

GitHub Actions が緑でも、期待したテストが今回の実行証拠を残したとは限りません。レポートが存在しない、古いファイルが残っている、テスト数が 0、または観測されたテスト数が想定外に減っている場合があります。

HonestCI はオープンソースの CLI と純粋な JavaScript Action です。テストコマンドをラップし、そのコマンドが実際に生成した JUnit XML を検査します。実行証拠から確定できる問題は job を失敗させます。`continue-on-error`、終了コードの握りつぶし、`--passWithNoTests`、動的なテスト条件などは、workflow の静的検査だけでは誤った実行と断定できないため warning に留めます。

現在の public beta は GitHub Actions と JUnit XML を対象とし、Ubuntu、Windows、macOS で動作します。ローカル実行、MIT License で、SaaS、telemetry、AI API、coverage 解析、自動 PR コメントはありません。通常の導入に必要な権限は `contents: read` だけです。

再現可能な demo では同じ zero-test runner を 2 回実行します。単独では exit 0 ですが、HonestCI が JUnit 証拠を検査すると `HCI004_ZERO_TESTS` で正しくブロックされ、exit 1 になります。

Repository、5 分 Quick Start、demo：
https://github.com/f0909172434/honest-ci

機密情報を除いた false-green 例、hard false positive、導入が 5 分で終わらなかった箇所を歓迎します。

HonestCI が検証するのは観測可能な CI 実行証拠だけです。テストの十分性、assertion の妥当性、必要な全テストの存在、プログラムの正しさは証明しません。

## Show HN first comment

The smallest reproduction is in `demo/launch`:

1. `node demo/launch/false-green-runner.mjs` writes a JUnit report with zero tests and exits 0.
2. `node dist/cli/index.js run --config demo/launch/honest-ci.yml -- node demo/launch/false-green-runner.mjs` runs the same command and exits 1 with `HCI004_ZERO_TESTS`.
3. `npm run demo:verify` asserts both exit codes and the finding.

Definite report evidence blocks. Workflow patterns that are merely suspicious remain warnings. The beta is intentionally limited to GitHub Actions and JUnit XML, and it does not claim that a test suite is sufficient or that software is correct.

I am especially interested in reproducible hard false positives and sanitized false-green cases from real workflows.

## DEV #showdev case-study draft

Title: HonestCI: reproducing a green GitHub Actions run with zero JUnit tests

The failure mode is small enough to reproduce: a misconfigured runner writes `<testsuite tests="0">` and exits 0. Ordinary CI sees a successful process. HonestCI checks the report produced by that same process and returns `HCI004_ZERO_TESTS` with exit 1.

The distinction matters. A workflow containing `continue-on-error` or `|| true` is suspicious, but static YAML inspection cannot prove a particular run was invalid. HonestCI reports those patterns as warnings. Missing, malformed, unchanged, zero-test, failed, or errored JUnit evidence is observable, so those findings are hard failures.

The beta also supports minimum counts, optional skipped limits, and a committed default-branch baseline. On pull requests it reads the baseline from the base commit so a pull request cannot lower its own comparison target in the workspace copy.

There is no service or telemetry. The project supports GitHub Actions and JUnit XML on Ubuntu, Windows, and macOS, and the normal permission is `contents: read`.

Run the before/after demo and inspect the stable finding codes here:
https://github.com/f0909172434/honest-ci

Limits are explicit: this verifies observable execution evidence, not test quality, assertion quality, completeness, coverage, or program correctness.

Tags: #showdev #githubactions #testing #opensource

## Reddit r/devops weekly-thread reply

Disclosure: I maintain HonestCI, an MIT-licensed CLI and GitHub Action for checking whether a green GitHub Actions run actually produced the expected JUnit evidence.

The reproducible demo uses a runner that writes a zero-test JUnit report and exits 0. Without verification, the command stays green. Wrapped by HonestCI, the same runner is blocked with `HCI004_ZERO_TESTS`. It also checks missing, malformed, stale, failed, or errored reports and configurable count drops. Ambiguous YAML patterns remain warnings.

The beta is GitHub Actions + JUnit XML only, with no SaaS, telemetry, AI API, coverage analysis, or PR comments. I am looking for sanitized false-green cases, hard false positives, and onboarding friction:
https://github.com/f0909172434/honest-ci
