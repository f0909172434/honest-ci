# Test runner recipes

HonestCI needs JUnit XML. It does not require a particular language or test framework. Keep the report path in the test command and `honest-ci.yml` identical.

## Vitest

```yaml
- uses: actions/checkout@v7
- uses: actions/setup-node@v7
  with:
    node-version: 24
    cache: npm
- run: npm ci
- uses: f0909172434/honest-ci@v1.0.0
  with:
    command: npm test -- --reporter=default --reporter=junit --outputFile.junit=reports/junit.xml
    config: honest-ci.yml
    github-token: ${{ github.token }}
```

Use `paths: [reports/junit.xml]` in the configuration.

## Jest

Install `jest-junit`, then configure the output at job level:

```yaml
env:
  JEST_JUNIT_OUTPUT_DIR: reports
  JEST_JUNIT_OUTPUT_NAME: junit.xml
steps:
  - uses: actions/checkout@v7
  - uses: actions/setup-node@v7
    with:
      node-version: 24
      cache: npm
  - run: npm ci
  - uses: f0909172434/honest-ci@v1.0.0
    with:
      command: npm test -- --ci --reporters=default --reporters=jest-junit
      config: honest-ci.yml
      github-token: ${{ github.token }}
```

Do not add `--passWithNoTests`; HonestCI intentionally warns about it.

## pytest

```yaml
- uses: actions/checkout@v7
- uses: actions/setup-python@v7
  with:
    python-version: "3.13"
- run: python -m pip install -r requirements.txt
- uses: f0909172434/honest-ci@v1.0.0
  with:
    command: python -m pytest --junitxml=reports/junit.xml
    config: honest-ci.yml
    github-token: ${{ github.token }}
```

## Maven Surefire

Surefire normally writes JUnit-compatible XML under `target/surefire-reports/`:

```yaml
- uses: actions/checkout@v7
- uses: actions/setup-java@v5
  with:
    distribution: temurin
    java-version: "21"
    cache: maven
- uses: f0909172434/honest-ci@v1.0.0
  with:
    command: mvn --batch-mode test
    config: honest-ci.yml
    github-token: ${{ github.token }}
```

Use `paths: [target/surefire-reports/*.xml]` and let HonestCI aggregate the files.

## When the Action cannot wrap the command

Run the test in its existing step, then use the Action without `command`. HonestCI will validate the report and emit `HCI107_FRESHNESS_UNVERIFIED` because a standalone check cannot prove which process created the file.

Prefer wrapping the command when possible. After a successful default-branch run, generate and commit the baseline with `npx honest-ci baseline write`. Install the reproducible stable package with `honest-ci@1.0.0`.
