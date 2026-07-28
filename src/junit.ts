import { readFile } from "node:fs/promises";

import { XMLParser, XMLValidator } from "fast-xml-parser";

import { HonestCIInputError, ZERO_TOTALS, addTotals, type TestTotals } from "./types.js";

const FORBIDDEN_XML = /<!\s*(?:DOCTYPE|ENTITY)\b/i;

function asArray(value: unknown): unknown[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function countAttribute(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) return Number(value);
  return 0;
}

function testcaseTotals(value: unknown): TestTotals {
  const rawTestcases = asArray(value);
  const testcases = rawTestcases.map(asRecord).filter((entry): entry is Record<string, unknown> => entry !== null);
  return {
    tests: rawTestcases.length,
    failures: testcases.filter((entry) => entry.failure !== undefined).length,
    errors: testcases.filter((entry) => entry.error !== undefined).length,
    skipped: testcases.filter((entry) => entry.skipped !== undefined || entry.disabled !== undefined).length,
  };
}

function suiteTotals(value: unknown): TestTotals {
  const suite = asRecord(value);
  if (!suite) return ZERO_TOTALS;
  const children = asArray(suite.testsuite);
  const directCases = testcaseTotals(suite.testcase);
  let nested = ZERO_TOTALS;
  for (const child of children) nested = addTotals(nested, suiteTotals(child));

  if (directCases.tests > 0 || children.length > 0) return addTotals(directCases, nested);
  return {
    tests: countAttribute(suite["@_tests"]),
    failures: countAttribute(suite["@_failures"]),
    errors: countAttribute(suite["@_errors"]),
    skipped: countAttribute(suite["@_skipped"]) + countAttribute(suite["@_disabled"]),
  };
}

export function parseJUnitXml(source: string): TestTotals {
  if (FORBIDDEN_XML.test(source)) {
    throw new HonestCIInputError("DTD and entity declarations are not allowed in JUnit XML.");
  }
  const validation = XMLValidator.validate(source, { allowBooleanAttributes: true });
  if (validation !== true) {
    throw new HonestCIInputError(`Invalid XML: ${validation.err.msg} (line ${validation.err.line}).`);
  }
  const parser = new XMLParser({
    allowBooleanAttributes: true,
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseAttributeValue: true,
    processEntities: false,
    removeNSPrefix: true,
  });
  const parsed = asRecord(parser.parse(source));
  if (!parsed) throw new HonestCIInputError("JUnit XML root must be an element.");

  if (parsed.testsuite !== undefined) return suiteTotals(parsed.testsuite);
  const containers = asArray(parsed.testsuites);
  let total = ZERO_TOTALS;
  for (const containerValue of containers) {
    const container = asRecord(containerValue);
    if (!container) continue;
    const suites = asArray(container.testsuite);
    if (suites.length === 0) {
      total = addTotals(total, {
        tests: countAttribute(container["@_tests"]),
        failures: countAttribute(container["@_failures"]),
        errors: countAttribute(container["@_errors"]),
        skipped: countAttribute(container["@_skipped"]) + countAttribute(container["@_disabled"]),
      });
    } else {
      for (const suite of suites) total = addTotals(total, suiteTotals(suite));
    }
  }
  if (containers.length === 0) throw new HonestCIInputError("Expected a <testsuite> or <testsuites> root.");
  return total;
}

export async function parseJUnitFile(file: string): Promise<TestTotals> {
  return parseJUnitXml(await readFile(file, "utf8"));
}
