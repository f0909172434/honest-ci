import { describe, expect, it } from "vitest";

import { parseJUnitXml } from "../src/junit.js";

describe("parseJUnitXml", () => {
  it("reads counters from a leaf testsuite", () => {
    expect(parseJUnitXml('<testsuite tests="10" failures="1" errors="2" skipped="3"/>')).toEqual({
      tests: 10,
      failures: 1,
      errors: 2,
      skipped: 3,
    });
  });

  it("counts testcase elements, including empty and failed cases", () => {
    const xml = `
      <testsuite>
        <testcase name="ok"/>
        <testcase name="bad"><failure message="no"/></testcase>
        <testcase name="broken"><error/></testcase>
        <testcase name="later"><skipped/></testcase>
      </testsuite>`;
    expect(parseJUnitXml(xml)).toEqual({ tests: 4, failures: 1, errors: 1, skipped: 1 });
  });

  it("aggregates nested, namespaced suites without double counting parent attributes", () => {
    const xml = `
      <j:testsuites xmlns:j="urn:junit" tests="999">
        <j:testsuite name="parent" tests="999">
          <j:testsuite name="one"><j:testcase/><j:testcase><j:skipped/></j:testcase></j:testsuite>
          <j:testsuite name="two" tests="3" failures="1" errors="0" skipped="0"/>
        </j:testsuite>
      </j:testsuites>`;
    expect(parseJUnitXml(xml)).toEqual({ tests: 5, failures: 1, errors: 0, skipped: 1 });
  });

  it("aggregates multiple suites", () => {
    const xml = '<testsuites><testsuite tests="3"/><testsuite tests="4" skipped="1"/></testsuites>';
    expect(parseJUnitXml(xml)).toEqual({ tests: 7, failures: 0, errors: 0, skipped: 1 });
  });

  it.each([
    '<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><testsuite tests="1"/>',
    '<!ENTITY xxe SYSTEM "https://example.com/evil"><testsuite tests="1"/>',
  ])("rejects DTD and entity declarations", (xml) => {
    expect(() => parseJUnitXml(xml)).toThrow(/not allowed/i);
  });

  it("rejects malformed XML", () => {
    expect(() => parseJUnitXml("<testsuite><testcase></testsuite>")).toThrow(/invalid xml/i);
  });
});
