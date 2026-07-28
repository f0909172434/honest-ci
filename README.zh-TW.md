# HonestCI

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md)

讓綠燈 CI 真正代表「預期執行的測試確實有執行」。

HonestCI 會包住測試命令、驗證本次新產生或變更的 JUnit 證據、與預設分支的可信基準比較測試數，並警告 GitHub Actions 中可疑的假綠燈寫法。

```text
加入前：npm test || true                 → 綠燈
加入後：JUnit XML 未更新或不存在         → HCI003 / HCI001 → 阻擋
```

發布狀態：公開 beta 候選版。原始碼與封裝後的 Action 已可審查；npm 套件及 `v0` 標籤會等待使用者核准後才發布。

## 五分鐘 Quick Start

先設定測試工具輸出 JUnit XML，再新增 `honest-ci.yml`：

```yaml
version: 1
reports:
  - name: unit
    paths: [reports/junit*.xml]
    format: junit
    min_tests: 1
    max_drop_percent: 10
    max_skipped_percent: null
baseline:
  file: .honest-ci/baseline.json
  source: default-branch
workflows:
  paths: [.github/workflows/*.yml]
```

在 checkout 與安裝依賴之後加入 Action，並把範例命令換成你的 JUnit 測試命令。核准 beta 發布後才會建立 `v0` 參照。

```yaml
- uses: f0909172434/honest-ci@v0
  with:
    command: npm test -- --reporter=junit --outputFile=reports/junit.xml
    config: honest-ci.yml
    github-token: ${{ github.token }}
```

預設分支成功執行後，產生、檢查並提交基準：

```console
npx honest-ci baseline write --config honest-ci.yml
git add .honest-ci/baseline.json
git commit -m "Add HonestCI baseline"
```

Action 只需要 `contents: read`，會寫入 annotations 與 Job Summary，不會自動在 PR 留言。

## 會攔截的問題

具有明確執行證據的問題會失敗：

- 測試命令回傳非零。
- 必要報告不存在、損壞、不安全或本次沒有更新。
- 測試數為零、低於最低值，或存在 failures／errors。
- 測試數相對可信基準下降超過門檻。
- 使用者設定 skipped 上限且結果超標。

只能靜態懷疑的情況維持警告：

- `continue-on-error: true`
- `|| true` 或強制 `exit 0`
- Jest／Vitest 的 `--passWithNoTests`
- 可能略過測試 job 或 step 的動態條件

穩定的機器介面請見 [finding codes](docs/FINDINGS.md)。

## CLI

需要 Node.js 20 以上。

```console
npm install --save-dev honest-ci
npx honest-ci lint
npx honest-ci run --config honest-ci.yml -- npm test
npx honest-ci check --config honest-ci.yml
npx honest-ci baseline write --config honest-ci.yml
```

人類閱讀使用 `--format pretty`，自動化使用 `--format json`。Exit code 0 表示通過、1 表示確定問題、2 表示設定或輸入錯誤。

## 可重現的假綠燈 demo

在原始碼根目錄執行：

```console
npm ci
npm run build
node dist/cli/index.js lint --config demo/false-green/honest-ci.yml
node dist/cli/index.js check --config demo/false-green/honest-ci.yml
node dist/cli/index.js check --config demo/healthy/honest-ci.yml
```

第一個命令會警告四種常見 workflow 風險；第二個命令會因 JUnit 明確記錄零測試而失敗；健康 fixture 不會出現 hard finding。詳見 [demo 說明](demo/README.md)。

## 可信基準

PR 執行時，Action 透過 GitHub API 從 base commit 取得 `.honest-ci/baseline.json`。PR 無法靠修改自己工作區的副本降低比較目標。若 fork 沒有權限讀取基準，HonestCI 仍執行固定最低測試數檢查，並顯示 `HCI106_BASELINE_UNAVAILABLE`。

## 範圍與限制

HonestCI v1 支援 GitHub Actions、JUnit XML、Ubuntu、Windows 與 macOS。不執行 workflow YAML、不提供 SaaS、不分析覆蓋率、不支援 GitLab／CircleCI／TRX、不呼叫 AI API，也不自動在 PR 留言。

HonestCI 只驗證可觀察的 CI 執行證據。它不證明測試充分、斷言有意義、所有應有測試都存在，也不證明程式正確。

設定：[docs/CONFIGURATION.md](docs/CONFIGURATION.md) · 安全：[docs/SECURITY.md](docs/SECURITY.md) · 貢獻：[CONTRIBUTING.md](CONTRIBUTING.md)

MIT License
