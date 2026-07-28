# HonestCI

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md)

让绿色 CI 真正表示“预期运行的测试确实运行了”。

HonestCI 会包裹测试命令、验证本次新生成或变更的 JUnit 证据、与默认分支的可信基准比较测试数量，并警告 GitHub Actions 中可疑的假绿灯写法。

![加入 HonestCI 前后的可复现假绿灯结果](launch/assets/false-green-before-after.png)

[复现 before/after demo](launch/DEMO.md)：同一个零测试 runner 单独运行时 exit 0；HonestCI 检查其 JUnit 证据后，会以 `HCI004_ZERO_TESTS` 阻止。

```text
加入前：npm test || true                 → 绿灯
加入后：JUnit XML 未更新或不存在         → HCI003 / HCI001 → 阻止
```

发布状态：公开 beta `v0.1.0-beta.1`。下方 Action 固定到该版本的完整 commit，CLI 则使用同版本的 GitHub Release 资产；npm registry 软件包尚未发布。

## 五分钟 Quick Start

先设置测试工具输出 JUnit XML，再添加 `honest-ci.yml`：

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

在 checkout 和依赖安装步骤之后加入 Action，并将示例命令替换为你的 JUnit 测试命令。完整 commit pin 可避免标签移动时改变 workflow 内容。

```yaml
- uses: f0909172434/honest-ci@f9c3926912d33ccc070ccfff6c956759e0f687f8 # v0.1.0-beta.1
  with:
    command: npm test -- --reporter=junit --outputFile=reports/junit.xml
    config: honest-ci.yml
    github-token: ${{ github.token }}
```

安装固定版本的 CLI 资产。此命令从 GitHub Releases 获取同一个 beta，不需要 npm registry 发布：

```console
npm install --save-dev https://github.com/f0909172434/honest-ci/releases/download/v0.1.0-beta.1/honest-ci-0.1.0-beta.1.tgz
```

默认分支成功运行后，生成、检查并提交基准：

```console
npx honest-ci baseline write --config honest-ci.yml
git add .honest-ci/baseline.json
git commit -m "Add HonestCI baseline"
```

Action 只需要 `contents: read`，会写入 annotations 和 Job Summary，不会自动在 PR 留言。

## 会拦截的问题

具有明确运行证据的问题会失败：

- 测试命令返回非零。
- 必要报告不存在、损坏、不安全或本次没有更新。
- 测试数为零、低于最低值，或存在 failures／errors。
- 测试数相对可信基准下降超过阈值。
- 用户设置 skipped 上限且结果超标。

只能静态怀疑的情况保持为警告：

- `continue-on-error: true`
- `|| true` 或强制 `exit 0`
- Jest／Vitest 的 `--passWithNoTests`
- 可能跳过测试 job 或 step 的动态条件

稳定的机器接口请参阅 [finding codes](docs/FINDINGS.md)。

## CLI

需要 Node.js 20 或更高版本。

```console
npm install --save-dev https://github.com/f0909172434/honest-ci/releases/download/v0.1.0-beta.1/honest-ci-0.1.0-beta.1.tgz
npx honest-ci lint
npx honest-ci run --config honest-ci.yml -- npm test
npx honest-ci check --config honest-ci.yml
npx honest-ci baseline write --config honest-ci.yml
```

人工阅读使用 `--format pretty`，自动化使用 `--format json`。Exit code 0 表示通过、1 表示确定问题、2 表示配置或输入错误。

## 可复现的假绿灯 demo

在源代码根目录运行：

```console
npm ci
npm run build
node dist/cli/index.js lint --config demo/false-green/honest-ci.yml
node dist/cli/index.js check --config demo/false-green/honest-ci.yml
node dist/cli/index.js check --config demo/healthy/honest-ci.yml
```

第一个命令会警告四类常见 workflow 风险；第二个命令会因 JUnit 明确记录零测试而失败；健康 fixture 不会产生 hard finding。详情请参阅 [demo 说明](demo/README.md)。

## 可信基准

PR 运行时，Action 通过 GitHub API 从 base commit 获取 `.honest-ci/baseline.json`。PR 不能通过修改工作区副本来降低比较目标。如果 fork 无权读取基准，HonestCI 仍执行固定最低测试数检查，并显示 `HCI106_BASELINE_UNAVAILABLE`。

## 范围与限制

HonestCI v1 支持 GitHub Actions、JUnit XML、Ubuntu、Windows 和 macOS。它不执行 workflow YAML、不提供 SaaS、不分析覆盖率、不支持 GitLab／CircleCI／TRX、不调用 AI API，也不自动在 PR 留言。

HonestCI 只验证可观察的 CI 运行证据。它不证明测试充分、断言有意义、所有应有测试都存在，也不证明程序正确。

配置：[docs/CONFIGURATION.md](docs/CONFIGURATION.md) · [测试工具示例](docs/RUNNER_RECIPES.md) · [Beta 发布政策](docs/BETA_POLICY.md) · 安全：[docs/SECURITY.md](docs/SECURITY.md) · 贡献：[CONTRIBUTING.md](CONTRIBUTING.md)

MIT License
