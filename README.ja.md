# HonestCI

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md)

緑の CI を「期待したテストが実際に実行された」という意味にします。

HonestCI はテストコマンドをラップし、今回生成または更新された JUnit 証拠を検証し、観測されたテスト数をデフォルトブランチの信頼できるベースラインと比較します。また、GitHub Actions にある偽の成功につながり得る記述を警告します。

![HonestCI 導入前後の再現可能な false-green 結果](launch/assets/false-green-before-after.png)

[before/after demo を再現](launch/DEMO.md)：同じ zero-test runner は単独で exit 0 ですが、HonestCI が JUnit 証拠を検査すると `HCI004_ZERO_TESTS` でブロックされます。

```text
導入前：npm test || true                 → 成功
導入後：JUnit XML が未更新または存在しない → HCI003 / HCI001 → ブロック
```

リリース状況：`v1.0.4`。1.x の公開インターフェースは前方互換な追加変更を維持します。再現可能な利用には `v1.0.4` を固定し、moving `v1` は最新の互換 1.x リリースに追従します。

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

checkout と依存関係のインストール後に Action を追加し、例のコマンドを利用中のランナーの JUnit コマンドに置き換えます。完全な commit pin により、タグが移動しても workflow の内容は変わりません。

```yaml
- uses: f0909172434/honest-ci@v1.0.4
  with:
    command: npm test -- --reporter=junit --outputFile=reports/junit.xml
    config: honest-ci.yml
    github-token: ${{ github.token }}
    evidence-output: .honest-ci/evidence.json
```

バージョン固定の CLI アセットをインストールします。同じ beta を GitHub Releases から取得するため、npm registry での公開は不要です。

```console
npm install --save-dev honest-ci@1.0.4
```

デフォルトブランチで成功した後、ベースラインを生成、確認、コミットします。

```console
npx honest-ci baseline write --config honest-ci.yml -- npm test
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
npm install --save-dev honest-ci@1.0.4
npx honest-ci lint
npx honest-ci run --config honest-ci.yml -- npm test
npx honest-ci check --config honest-ci.yml
npx honest-ci baseline write --config honest-ci.yml -- npm test
```

人が読む場合は `--format pretty`、自動処理には `--format json` を使います。Exit code は、成功が 0、確定問題が 1、設定または入力エラーが 2 です。
`baseline write` にはテストコマンドを渡すことを推奨します。コマンドが成功し、設定済みレポートが更新された場合にのみ HonestCI はベースラインを書き込みます。互換性のためコマンドは省略できますが、既存レポートには `HCI107_FRESHNESS_UNVERIFIED` が付きます。

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

レポート欠落、テスト数 0、古いレポート、テスト数減少、失敗テスト、パス探索を含む 7 つの分離シナリオは `npm run demo:scenarios` でまとめて再現できます。[シナリオ表](demo/scenarios/README.md)を参照してください。

## 信頼できるベースライン

PR では、Action が GitHub API を使って base commit の `.honest-ci/baseline.json` を読みます。PR 内でワークスペースのコピーを書き換えて比較基準を下げることはできません。fork に読み取り権限がない場合も、HonestCI は固定の最小テスト数を検査し、`HCI106_BASELINE_UNAVAILABLE` を表示します。

## 対象範囲と制限

HonestCI v1 は GitHub Actions、JUnit XML、Ubuntu、Windows、macOS に対応します。workflow YAML の実行、SaaS、カバレッジ分析、GitLab／CircleCI／TRX、AI API、PR への自動コメントは対象外です。

HonestCI が検証するのは観測可能な CI 実行証拠です。テストの十分性、アサーションの妥当性、必要なテストがすべて存在すること、プログラムの正しさは証明しません。

設定：[docs/CONFIGURATION.md](docs/CONFIGURATION.md) · [テストランナー例](docs/RUNNER_RECIPES.md) · [互換性と制限](docs/COMPATIBILITY.md) · [リリース方針](docs/RELEASE_POLICY.md) · セキュリティ：[SECURITY.md](SECURITY.md) · [脅威モデル](docs/THREAT_MODEL.md) · コントリビューション：[CONTRIBUTING.md](CONTRIBUTING.md) · [メンテナンス](docs/MAINTENANCE.md) · [公開導入証拠](ADOPTION.md)

## Evidence Bundle v1

`run` と `check` は `--evidence-output .honest-ci/evidence.json` で RigorGraph Evidence Bundle v1 を生成できます。Action は同名 input と `evidence-path` output を提供します。バンドルに含まれるのは結果要約、設定／report／baseline／workflow のハッシュ、allowlist に限定した GitHub provenance だけです。JUnit 本文、テスト名、log、任意の環境変数、秘密は含みません。ハッシュは観測した bytes を保存しますが、runner の真正性、テスト品質、プログラムの正しさを証明しません。[Evidence Bundle v1](docs/EVIDENCE_BUNDLES.md) と [リリース方針](docs/RELEASE_POLICY.md) を参照してください。

MIT License
