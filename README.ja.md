# HonestCI

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md)

緑の CI を「期待したテストが実際に実行された」という意味にします。

HonestCI はテストコマンドをラップし、今回生成または更新された JUnit 証拠を検証し、観測されたテスト数をデフォルトブランチの信頼できるベースラインと比較します。また、GitHub Actions にある偽の成功につながり得る記述を警告します。

```text
導入前：npm test || true                 → 成功
導入後：JUnit XML が未更新または存在しない → HCI003 / HCI001 → ブロック
```

リリース状況：公開 beta `v0.1.0-beta.1` です。Action は下記の不変 beta タグから利用できます。npm パッケージはまだ公開していません。

## 5 分 Quick Start

まずテストランナーから JUnit XML を出力し、`honest-ci.yml` を追加します。

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

checkout と依存関係のインストール後に Action を追加し、例のコマンドを利用中のランナーの JUnit コマンドに置き換えます。不変の beta タグを固定すると workflow の再現性を保てます。

```yaml
- uses: f0909172434/honest-ci@v0.1.0-beta.1
  with:
    command: npm test -- --reporter=junit --outputFile=reports/junit.xml
    config: honest-ci.yml
    github-token: ${{ github.token }}
```

デフォルトブランチで成功した後、ベースラインを生成、確認、コミットします。

```console
npx honest-ci baseline write --config honest-ci.yml
git add .honest-ci/baseline.json
git commit -m "Add HonestCI baseline"
```

Action に必要な権限は `contents: read` のみです。annotations と Job Summary を出力し、PR コメントは自動投稿しません。

## 検出する問題

観測可能で確定的な問題は実行を失敗させます。

- ラップしたコマンドが 0 以外を返した。
- 必須レポートが存在しない、破損、安全でない、または今回更新されていない。
- テスト数が 0、最小値未満、または failures／errors がある。
- 信頼できるベースラインからの減少率が設定値を超えた。
- skipped 率が明示的な上限を超えた。

静的解析だけでは確定できないものは警告のままです。

- `continue-on-error: true`
- `|| true` または強制的な `exit 0`
- Jest／Vitest の `--passWithNoTests`
- テストらしい job や step を省略し得る動的条件

安定した機械向けインターフェースは [finding codes](docs/FINDINGS.md) を参照してください。

## CLI

Node.js 20 以降が必要です。

```console
npm install --save-dev honest-ci
npx honest-ci lint
npx honest-ci run --config honest-ci.yml -- npm test
npx honest-ci check --config honest-ci.yml
npx honest-ci baseline write --config honest-ci.yml
```

人が読む場合は `--format pretty`、自動処理には `--format json` を使います。Exit code は、成功が 0、確定問題が 1、設定または入力エラーが 2 です。

## 再現可能な偽の成功 demo

ソースのルートで実行します。

```console
npm ci
npm run build
node dist/cli/index.js lint --config demo/false-green/honest-ci.yml
node dist/cli/index.js check --config demo/false-green/honest-ci.yml
node dist/cli/index.js check --config demo/healthy/honest-ci.yml
```

最初のコマンドは 4 種類の一般的な workflow リスクを警告します。2 番目は JUnit がテスト数 0 を明示しているため失敗します。健全な fixture には hard finding がありません。詳細は [demo](demo/README.md) を参照してください。

## 信頼できるベースライン

PR では、Action が GitHub API を使って base commit の `.honest-ci/baseline.json` を読みます。PR 内でワークスペースのコピーを書き換えて比較基準を下げることはできません。fork に読み取り権限がない場合も、HonestCI は固定の最小テスト数を検査し、`HCI106_BASELINE_UNAVAILABLE` を表示します。

## 対象範囲と制限

HonestCI v1 は GitHub Actions、JUnit XML、Ubuntu、Windows、macOS に対応します。workflow YAML の実行、SaaS、カバレッジ分析、GitLab／CircleCI／TRX、AI API、PR への自動コメントは対象外です。

HonestCI が検証するのは観測可能な CI 実行証拠です。テストの十分性、アサーションの妥当性、必要なテストがすべて存在すること、プログラムの正しさは証明しません。

設定：[docs/CONFIGURATION.md](docs/CONFIGURATION.md) · [テストランナー例](docs/RUNNER_RECIPES.md) · [Beta リリース方針](docs/BETA_POLICY.md) · セキュリティ：[docs/SECURITY.md](docs/SECURITY.md) · コントリビューション：[CONTRIBUTING.md](CONTRIBUTING.md)

MIT License
