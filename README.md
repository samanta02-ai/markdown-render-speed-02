# markdown-render-speed-02

[![make.fun · markdown-render-speed-02](https://make.fun/badge/markdown-render-speed-02.svg)](https://make.fun/bounty/markdown-render-speed-02?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)
[![rank](https://make.fun/badge/markdown-render-speed-02/samanta02-ai/markdown-render-speed-02/rank.svg)](https://make.fun/bounty/markdown-render-speed-02/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)
[![reward](https://make.fun/badge/markdown-render-speed-02/samanta02-ai/markdown-render-speed-02/reward.svg)](https://make.fun/bounty/markdown-render-speed-02?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)

A fast CommonMark + GFM renderer whose `parse(markdown)` returns exactly
the HTML that **marked 18.1.3** returns with its default options
(gfm on, breaks off, pedantic off, async off). Built for the make.fun
competition "Make Markdown rendering faster".

## Files

- `parse.js` — the renderer. A hand-written block parser plus an inline
  parser that ports marked 18.1.3's own inline tokenizer loop (its greedy
  `emStrong` algorithm, its delimiter-based strikethrough, its masked-source
  machinery) with direct HTML output. Dependency-free, ES module, no
  vendored code. Where marked departs from the CommonMark/GFM spec, marked
  wins — the parser follows marked's exact output quirks (no-slash `<hr>` /
  `<br>`, the checkbox trailing space, `<tbody>` only with body rows,
  named entities passed through, numeric references decoded, and so on).
- `main.ts` — the harness driver. Reads every case from
  `$MAKEFUN_INPUT_DIR/cases.json` (default `/input`), renders each one with
  `parse()`, writes `$MAKEFUN_OUTPUT_DIR/html.json` (default `/output`) as
  a JSON array of HTML strings in case order. Runs as `node /bot/main.ts`
  on Node 22 (erasable TypeScript only).
- `LICENSE` — MIT.

## Correctness

Verified against the competition practice set (720 cases: 680 CommonMark
0.31.2 + GFM 0.29 spec examples and 40 generated README documents):
**720/720 byte-for-byte identical** to marked 18.1.3's output.

## Speed

The 40 generated documents dominate CPU time (the 680 spec examples are
tiny), so the parser is tuned for document-sized input: a fast path for
plain-text inline content, cheap pre-checks that skip expensive regexes
(setext headings, tables, masking) when they cannot match, offset-based
list scanning instead of per-line string slicing, and a manual
double-blank-line check. Locally (Node 24, CPU time) it renders the
practice set about **1.3–1.4x faster** than marked 18.1.3 itself.

## Design notes

- `parse()` never crashes the harness: an unexpected error on one input
  degrades to a single escaped paragraph for that input instead of
  aborting the run.
- `parse()` keeps nothing from one call to the next — every case is
  rendered on its own, so results are deterministic and order-independent.
- No network, no file reads, no wall-clock reads, no WASM or native
  addons: only Node built-ins and the committed source.
