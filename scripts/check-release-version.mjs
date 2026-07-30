import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const expectedTag = `v${packageJson.version}`;
const actualTag = process.argv[2] ?? process.env.GITHUB_REF_NAME;

if (!actualTag) throw new Error("Pass a tag or set GITHUB_REF_NAME.");
if (actualTag !== expectedTag) {
  throw new Error(`Release tag ${actualTag} does not match package version ${packageJson.version}.`);
}
console.log(`Release version matches: ${actualTag}`);
