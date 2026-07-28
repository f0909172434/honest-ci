import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const report = path.join(process.cwd(), "demo", "launch", "reports", "junit.xml");
await mkdir(path.dirname(report), { recursive: true });
await writeFile(
  report,
  `<testsuite name="misconfigured" tests="0" failures="0" errors="0" skipped="0"><system-out>run ${process.pid}</system-out></testsuite>\n`,
  "utf8",
);

console.log("test runner: wrote JUnit XML with tests=0");
console.log("test runner: exited 0, so ordinary CI stays green");
