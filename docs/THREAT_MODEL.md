# HonestCI threat model

## Protected assets

- the integrity of a test command's exit status and fresh JUnit result;
- the trusted default-branch baseline used for comparison;
- the GitHub token used to read that baseline;
- the workspace boundary and files outside it; and
- the confidentiality of test names, logs, environment variables, and secrets.

## Trust boundaries

Pull-request files, workflow YAML, configuration, JUnit XML, path globs, and
baseline contents are untrusted inputs. The GitHub API response for the base
commit is trusted only after normal TLS and repository authorization checks.
The explicit test command is trusted operator input: HonestCI runs it but does
not sandbox it.

## Threats and controls

| Threat | Control |
| --- | --- |
| Missing, empty, or stale reports create a false-green run | Required reports, freshness checks, minimum counts, and stable hard findings |
| A pull request lowers its own baseline | Fetch the baseline from the pull request base commit |
| XML entity expansion or external entity access | Reject DTD/entity declarations before parsing |
| Globs or symlinks escape the workspace | Confine, resolve, and recheck paths; do not follow symlinks |
| Workflow heuristics are mistaken for proof | Keep heuristic findings as warnings and document their limits |
| Credentials or private test data enter evidence | Allowlist fields; omit raw reports, names, logs, environment, and source |
| A mutable third-party Action changes release behavior | Pin workflow Actions to full commit SHAs and update them through review |

## Assumptions and non-goals

The runner, operating system, Node.js runtime, package registry, GitHub service,
and repository administrator are outside HonestCI's enforcement boundary. The
tool does not sandbox commands, attest runner identity, prove assertion quality,
detect every workflow bypass, or establish software correctness. A malicious
administrator with release credentials remains able to publish malicious code;
branch, tag, environment, and registry protections reduce but cannot eliminate
that risk.

## Security-sensitive changes

Changes to command execution, XML parsing, path resolution, token use, baseline
selection, evidence redaction, bundled Action output, or release workflows need
focused tests and review against this threat model.
