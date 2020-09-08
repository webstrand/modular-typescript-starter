#!/usr/bin/env -S TS_NODE_COMPILER_OPTIONS={\"strict\":true} node --loader ts-node/esm
import { readFileSync, writeFileSync } from "fs";

/** Named SemVer components */
const SemVer = {
	major: 0,
	minor: 1,
	patch: 2,
} as const;

/** Permitted operations */
type Op = keyof typeof SemVer;
function isOp(str: string): str is Op { return str in SemVer }

if(process.argv.length !== 3) usage();
const op: Op | string = process.argv[2].toLowerCase();
if(!isOp(op)) usage(op);

const json = readFileSync("package.json", "utf8");
const pkg: { version?: string } = JSON.parse(json);

const oldVer = pkg.version;
if(!oldVer) throw new Error(`package.version is undefined`);
console.log(`Old version: ${pkg.version}`);

const newVer = oldVer.split(".")
	.map((v, i) => (i === SemVer[op] ? +v + 1 : v)).join(".");
if(!newVer.match(/^\d+\.\d+\.\d+/)) throw new Error(`malformed package.version generated: ${newVer}`);
console.log(`New version: ${newVer}`);

// Find the permutation of the old json that correctly updates the version while
// preserving whitespace.
const newJson = matchAll(json, new RegExp(`"version"(\\s*):(\\s*)"${oldVer}"`, "g"))
	.map(match => json.slice(0, match.index)
		+ `"version"${match[1]}:${match[2]}"${newVer}"`
		+ json.slice(match.index + match[0].length))
	.find(json => JSON.parse(json).version === newVer);

if(!newJson) throw new Error("Unable to replace package.version");

writeFileSync("package.json", newJson, "utf8");

function usage(op?: string): never {
	console.error(`Usage: ${process.argv0} ${Object.keys(SemVer).join("|")}`);
	if(op) console.error(`Unknown operation ${op}`);
	process.exit(1);
}

function matchAll(str: string, regex: RegExp): RegExpExecArray[] {
	const results: RegExpExecArray[] = [];
	let match: RegExpExecArray;
	// eslint-disable-next-line no-cond-assign
	while(match = regex.exec(str)!) results.push(match);
	return results;
}
