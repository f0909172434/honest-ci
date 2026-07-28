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

## 繁體中文 Facebook／DevOps Taiwan 管理員詢問模板

您好，我是開源專案 HonestCI 的單人維護者。它用來檢查 GitHub Actions 是否真的產生預期的 JUnit 執行證據；目前只支援 GitHub Actions 與 JUnit XML，沒有 SaaS、遙測或商業服務。

我準備了一個可重現案例：同一個 runner 寫出零測試的 JUnit XML 並 exit 0，普通 CI 會保持綠燈；加入 HonestCI 後則以 `HCI004_ZERO_TESTS` exit 1。想先確認社團是否允許我發一篇完整技術分享，內容會包含重現步驟、限制、維護者揭露與 GitHub repository，不會徵集按讚、註冊或付費。

如果可以，也想請您告知適合的格式、標籤與發文時段；若不合適，我不會發布。謝謝。

## 繁體中文 Facebook／DevOps Taiwan 社團草稿

標題：同一個測試 runner exit 0，為什麼 CI 不該直接顯示綠燈？

先揭露：我是 HonestCI 的單人維護者。

這個可重現案例裡，測試 runner 寫出一份 `tests="0"` 的 JUnit XML，但程序本身 exit 0。普通 GitHub Actions 沒有失敗程序可攔截，所以 job 仍可能是綠燈。

```console
node demo/launch/false-green-runner.mjs
# exit 0
```

把同一個命令交給 HonestCI 包住後，它會檢查該命令本次產生的 JUnit 證據，發現零測試並回傳：

```text
HonestCI FAILED
ERROR HCI004_ZERO_TESTS Report "unit" contains zero tests.
# exit 1
```

它也會硬性攔截缺少、損壞、未更新、包含 failure/error 或低於設定門檻的報告。`continue-on-error`、`|| true`、`--passWithNoTests` 與動態條件則只會警告，因為單看 YAML 無法證明該次執行一定錯誤。

目前 beta 僅支援 GitHub Actions + JUnit XML，可在 Ubuntu、Windows、macOS 使用；一般權限只需要 `contents: read`。沒有 SaaS、遙測、AI API、coverage 分析或自動 PR 留言。

Repository、完整 demo 與五分鐘 Quick Start：
https://github.com/f0909172434/honest-ci

我想收集的是已移除敏感資訊的真實假綠燈案例、hard false positive，以及卡住導入的步驟。HonestCI 只驗證可觀察的 CI 執行證據，不證明測試充分、斷言有效或程式正確。

## Dcard 軟體工程師板完整草稿

標題：#分享 #GitHubActions 一個 exit 0 但 JUnit 測試數是 0 的假綠燈案例

先揭露：我是這個開源工具 HonestCI 的單人維護者，專案採 MIT License，沒有付費服務或遙測。

最近整理了一個 GitHub Actions 很容易被忽略的情境：測試 runner 因設定錯誤寫出 `tests="0"` 的 JUnit XML，但程序仍然 exit 0。CI 只看到 exit code 時，job 可以保持綠燈，但可觀察的報告其實沒有任何測試。

重現方式是先執行同一個假 runner：

```console
node demo/launch/false-green-runner.mjs
```

結果會寫出零測試報告並 exit 0。接著由 HonestCI 包住完全相同的命令：

```console
node dist/cli/index.js run --config demo/launch/honest-ci.yml -- node demo/launch/false-green-runner.mjs
```

這次會 exit 1，明確產生 `HCI004_ZERO_TESTS`。Repository 裡另有自動驗證腳本，會同時檢查前者 exit 0、後者 exit 1，以及 finding code 沒有被誤判成 stale report。

設計上，我把「執行證據確定有問題」與「靜態寫法可疑」分開。缺少、損壞、未更新、零測試、包含 failure/error 或測試數下降超過設定門檻的 JUnit 證據會失敗；`continue-on-error`、吞掉 exit code、`--passWithNoTests` 和動態條件只會警告，因為單靠 workflow YAML 不能證明那次執行一定錯。

目前 beta 只做 GitHub Actions + JUnit XML，支援 Ubuntu、Windows、macOS。沒有 SaaS、AI API、coverage 分析、自動 PR 留言，也不會宣稱測試品質或程式正確。

完整 source、demo、finding codes 與 Quick Start：
https://github.com/f0909172434/honest-ci

如果有人遇過「CI 綠燈但預期測試沒跑」或 hard false positive，歡迎在文章下提供已移除敏感資訊的最小案例。我會先重現，再把結果區分為確定證據、heuristic warning、false positive 或尚未解決的問題。

## 繁體中文 Threads 三則串文

第 1 則：

同一個測試 runner 寫出 JUnit `tests=0`，但程序 exit 0。普通 GitHub Actions 沒有失敗程序可攔，所以仍可能顯示綠燈。

我做的 HonestCI 會再檢查這次執行實際留下的 JUnit 證據。附圖是同一個 runner 的 before／after。

第 2 則：

沒有 HonestCI：exit 0。

加入 HonestCI：`HCI004_ZERO_TESTS`，exit 1。

缺少、損壞、未更新或包含 failure/error 的報告也會失敗；只看 YAML 才能發現的可疑寫法仍維持 warning，不把猜測升級成證明。

第 3 則：

公開 beta 目前只支援 GitHub Actions + JUnit XML，沒有 SaaS、遙測、AI API、coverage 分析或自動 PR 留言。

完整可重現 demo：
https://github.com/f0909172434/honest-ci

它驗證的是可觀察 CI 執行證據，不證明測試充分或程式正確。

## 繁體中文 X 三則串文

第 1 則：

同一個 runner 寫出 JUnit tests=0，程序卻 exit 0。普通 GitHub Actions 沒有失敗程序可攔，仍可能是綠燈。HonestCI 會檢查本次產生的 JUnit 證據。附圖是可重現的 before／after。

第 2 則：

沒有 HonestCI：exit 0。
加入後：HCI004_ZERO_TESTS，exit 1。

確定的報告問題會失敗；continue-on-error、吞掉 exit code 等靜態模式只警告，因為 YAML 本身不是那次執行的證明。

第 3 則：

Beta：GitHub Actions + JUnit XML，支援 Ubuntu／Windows／macOS。沒有 SaaS、遙測、AI API、coverage 或 PR 留言。

Demo 與 Quick Start：
https://github.com/f0909172434/honest-ci

只驗證可觀察的 CI 執行證據，不證明程式正確。

## 简体中文 V2EX 分享创造草稿

标题：分享一个检查 GitHub Actions 假绿灯的开源工具：HonestCI

先说明：我是 HonestCI 的单人维护者。这是 MIT 许可证的开源项目，没有 SaaS、遥测或付费服务，这篇主要想收集技术反馈和 hard false positive。

我复现了一个很小的 CI 失败模式：测试 runner 写出 `<testsuite tests="0">`，但进程仍然 exit 0。普通 GitHub Actions 只看到成功的进程时，job 可以保持绿色。

```console
node demo/launch/false-green-runner.mjs
# exit 0
```

让 HonestCI 包裹同一个命令后，它会检查这次运行真正生成的 JUnit XML：

```console
node dist/cli/index.js run --config demo/launch/honest-ci.yml -- node demo/launch/false-green-runner.mjs
```

结果是 exit 1，并输出 `HCI004_ZERO_TESTS`。仓库里的 `npm run demo:verify` 会自动断言前后两个 exit code、finding code，以及结果不是 stale-report 误判。

目前的硬失败包括：命令非零、报告缺失或损坏、已有报告没有被本次命令更新、零测试、低于最小测试数、JUnit failure/error、可配置的 skipped 上限和相对默认分支 baseline 的测试数下降。

`continue-on-error`、`|| true`、`--passWithNoTests` 和动态测试条件仍然只是 warning，因为只看 workflow YAML 不能证明某一次运行一定有问题。

Beta 范围刻意保持很小：只支持 GitHub Actions + JUnit XML，Node.js 20+ CLI，纯 JavaScript Action，Ubuntu／Windows／macOS。没有 GitLab、CircleCI、TRX、coverage、AI API、自动 PR 评论或托管服务。

源码、可复现 demo、finding codes 和五分钟 Quick Start：
https://github.com/f0909172434/honest-ci

如果你遇到过绿色 CI 但预期测试没有运行，或者这个工具拦截了健康运行，欢迎提供去掉敏感信息的最小 workflow、配置、JUnit 结构和 finding code。我会先复现，再判断是确定证据、heuristic、hard false positive 还是未解决问题。

HonestCI 只验证可观察的 CI 运行证据，不证明测试充分、断言有效或程序正确。

## 简体中文 SegmentFault 技术文章草稿

标题：从 exit 0 到可观察证据：复现一次 GitHub Actions 假绿灯

CI 的绿色状态通常来自进程退出码，但退出码并不总能回答“预期测试是否真的运行并留下了本次证据”。一个配置错误的 runner 可以写出零测试 JUnit XML，同时 exit 0。

最小复现先直接运行 runner：

```console
node demo/launch/false-green-runner.mjs
```

它写出 `tests="0"` 并成功退出。再用 HonestCI 包裹完全相同的命令：

```console
node dist/cli/index.js run --config demo/launch/honest-ci.yml -- node demo/launch/false-green-runner.mjs
```

HonestCI 会对命令前后的报告做快照，并解析本次生成的 JUnit 证据。这个案例不是 stale report，而是明确的零测试，因此输出 `HCI004_ZERO_TESTS` 并 exit 1。

这里刻意区分两类结论。报告缺失、损坏、未更新、零测试、failure/error 或越过配置门槛，属于可观察证据，可以 hard fail。`continue-on-error`、吞掉退出码、`--passWithNoTests`、动态条件等 workflow 模式只产生 warning，因为静态 YAML 不能证明具体运行结果。

Pull request 的 baseline 也不直接信任工作区副本。Action 会从 PR base commit 读取配置的 baseline；读取失败时保留固定最小值检查并产生 `HCI106_BASELINE_UNAVAILABLE`，而不是假装比较成功。

当前 beta 范围：GitHub Actions、JUnit XML、Node.js 20+ CLI、纯 JavaScript Action、Ubuntu／Windows／macOS。没有 SaaS、遥测、AI API、coverage、TRX、GitLab、CircleCI 或自动 PR 评论。

源码、完整 demo 和 finding code：
https://github.com/f0909172434/honest-ci

维护者声明：我是 HonestCI 的单人维护者。这个项目只验证可观察 CI 运行证据，不证明测试质量、断言完整性或程序正确性。

## 简体中文 X／Threads 短串

第 1 则：

同一个测试 runner 写出 JUnit tests=0，却 exit 0。普通 GitHub Actions 没有失败进程可拦，仍可能显示绿色。HonestCI 会检查这次运行真正生成的 JUnit 证据。

第 2 则：

直接运行：exit 0。
HonestCI 包裹后：HCI004_ZERO_TESTS，exit 1。

确定的报告问题 hard fail；continue-on-error、吞掉退出码等静态模式只 warning，不把猜测升级成证明。

第 3 则：

Beta 只支持 GitHub Actions + JUnit XML，没有 SaaS、遥测、AI API、coverage 或自动 PR 评论。

可复现 demo：
https://github.com/f0909172434/honest-ci

只验证可观察 CI 运行证据，不证明程序正确。
