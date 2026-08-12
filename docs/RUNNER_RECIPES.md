# Test runner recipes

HonestCI needs JUnit XML. It does not require a particular language or test framework. Keep the report path in the test command and `honest-ci.yml` identical.

These are documented starting points, not a promise that every producer
version and XML variant is continuously tested. See [compatibility and known
limitations](COMPATIBILITY.md) and submit a compatibility report when a recipe
works—or fails—in a real repository.

## Vitest

```yaml
- uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
- uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7
  with:
    node-version: 24
    cache: npm
- run: npm ci
- uses: f0909172434/honest-ci@v1.0.4
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
  - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
  - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7
    with:
      node-version: 24
      cache: npm
  - run: npm ci
  - uses: f0909172434/honest-ci@v1.0.4
    with:
      command: npm test -- --ci --reporters=default --reporters=jest-junit
      config: honest-ci.yml
      github-token: ${{ github.token }}
```

Do not add `--passWithNoTests`; HonestCI intentionally warns about it.

## pytest

```yaml
- uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
- uses: actions/setup-python@5fda3b95a4ea91299a34e894583c3862153e4b97 # v7
  with:
    python-version: "3.13"
- run: python -m pip install -r requirements.txt
- uses: f0909172434/honest-ci@v1.0.4
  with:
    command: python -m pytest --junitxml=reports/junit.xml
    config: honest-ci.yml
    github-token: ${{ github.token }}
```

## Maven Surefire

Surefire normally writes JUnit-compatible XML under `target/surefire-reports/`:

```yaml
- uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
- uses: actions/setup-java@b6effb05e454b25005698d916606bdc6ffcbf961 # v5
  with:
    distribution: temurin
    java-version: "21"
    cache: maven
- uses: f0909172434/honest-ci@v1.0.4
  with:
    command: mvn --batch-mode test
    config: honest-ci.yml
    github-token: ${{ github.token }}
```

Use `paths: [target/surefire-reports/*.xml]` and let HonestCI aggregate the files.

## When the Action cannot wrap the command

Run the test in its existing step, then use the Action without `command`. HonestCI will validate the report and emit `HCI107_FRESHNESS_UNVERIFIED` because a standalone check cannot prove which process created the file.

Prefer wrapping the command when possible. On the default branch, generate fresh reports and the baseline together with `npx honest-ci baseline write -- <test-command>`, then review and commit the baseline. Install the reproducible stable package with `honest-ci@1.0.4`.
