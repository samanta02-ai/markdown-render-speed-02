// Driver for the markdown-render-speed-02 entry.
//
// The harness runs `node /bot/main.ts` on Node 22 (native TypeScript
// type-stripping, so this file uses only erasable syntax: plain type
// annotations and `as` casts, no enums, no parameter properties).
//
// It reads every case from <input>/cases.json — a JSON array of objects
// `{id, markdown}` — renders each one on its own with parse() from
// ./parse.js, and writes <output>/html.json: a JSON array of the HTML
// strings, one per case and in the cases' order. The directories default
// to /input and /output; MAKEFUN_INPUT_DIR / MAKEFUN_OUTPUT_DIR override
// them (used when running outside the scoring container).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "./parse.js";

// One input case: an id plus the markdown source to render.
type Case = { id: string; markdown: string };

const inputDir = process.env.MAKEFUN_INPUT_DIR ?? "/input";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Read and parse the whole case list up front; each case is rendered
// independently, so parse() keeps nothing from one case to the next.
const cases: Case[] = JSON.parse(
  readFileSync(join(inputDir, "cases.json"), "utf8"),
) as Case[];

// Render in order. `map` keeps the output aligned with the input list.
const html: string[] = cases.map((c) => parse(c.markdown));

// Make sure the output directory exists, then write the results.
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "html.json"), JSON.stringify(html));
