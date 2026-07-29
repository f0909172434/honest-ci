export type Severity = "error" | "warning";

export type FindingCode =
  | "HCI001_MISSING_REPORT"
  | "HCI002_INVALID_REPORT"
  | "HCI003_STALE_REPORT"
  | "HCI004_ZERO_TESTS"
  | "HCI005_BELOW_MINIMUM"
  | "HCI006_TEST_FAILURES"
  | "HCI007_TEST_ERRORS"
  | "HCI008_BASELINE_DROP"
  | "HCI009_SKIPPED_LIMIT"
  | "HCI010_COMMAND_FAILED"
  | "HCI101_BASELINE_MISSING"
  | "HCI102_CONTINUE_ON_ERROR"
  | "HCI103_SWALLOWED_EXIT_CODE"
  | "HCI104_PASS_WITH_NO_TESTS"
  | "HCI105_DYNAMIC_CONDITION"
  | "HCI106_BASELINE_UNAVAILABLE"
  | "HCI107_FRESHNESS_UNVERIFIED";

export interface Finding {
  code: FindingCode;
  severity: Severity;
  message: string;
  file?: string;
  line?: number;
  report?: string;
}

export interface ReportConfig {
  name: string;
  paths: string[];
  format: "junit";
  minTests: number;
  maxDropPercent: number | null;
  maxSkippedPercent: number | null;
}

export interface HonestConfig {
  version: 1;
  reports: ReportConfig[];
  baseline: {
    file: string;
    source: "default-branch";
  };
  workflows: {
    paths: string[];
  };
}

export interface TestTotals {
  tests: number;
  failures: number;
  errors: number;
  skipped: number;
}

export interface ReportResult extends TestTotals {
  name: string;
  files: string[];
  baselineTests: number | null;
  dropPercent: number | null;
}

export interface BaselineReport extends TestTotals {}

export interface BaselineFile {
  version: 1;
  generatedAt: string;
  reports: Record<string, BaselineReport>;
}

export interface CheckResult {
  schemaVersion: 1;
  status: "passed" | "failed";
  totals: TestTotals;
  baselineTests: number | null;
  dropPercent: number | null;
  reports: ReportResult[];
  findings: Finding[];
}

export interface FileSignature {
  sha256: string;
  size: number;
  mtimeMs: number;
}

export interface EvidenceArtifact {
  role: "config" | "report" | "baseline" | "workflow";
  path: string;
  size: number;
  sha256: string;
}

export interface EvidenceProvenance {
  repository?: string;
  commit?: string;
  ref?: string;
  workflow_ref?: string;
  run_id?: string;
  run_attempt?: number;
  event?: string;
}

export interface EvidenceBundle {
  format: "rigorgraph-evidence-bundle";
  schema_version: 1;
  profile: "honest-ci/check-result-v1";
  evidence_type: "computation";
  title: string;
  scope: string;
  created_at: string;
  producer: { name: "honest-ci"; version: string };
  provenance?: EvidenceProvenance;
  artifacts: EvidenceArtifact[];
  result: CheckResult;
}

export type ReportSnapshots = Map<string, Map<string, FileSignature>>;

export class HonestCIInputError extends Error {
  readonly exitCode = 2;

  constructor(message: string) {
    super(message);
    this.name = "HonestCIInputError";
  }
}

export const ZERO_TOTALS: TestTotals = {
  tests: 0,
  failures: 0,
  errors: 0,
  skipped: 0,
};

export function addTotals(left: TestTotals, right: TestTotals): TestTotals {
  return {
    tests: left.tests + right.tests,
    failures: left.failures + right.failures,
    errors: left.errors + right.errors,
    skipped: left.skipped + right.skipped,
  };
}
