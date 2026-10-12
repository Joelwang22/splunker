# Splunk Helper

A browser-only workbench for learning to **compose classic SPL searches**. Build filters and metrics, walk through how the data changes, and adapt worked examples to your own questions.

Prepared for [Joelwang22/splunker](https://github.com/Joelwang22/splunker). Independent educational project; not affiliated with Splunk.

## Open it

- Double-click `index.html` with its sibling `.js` and `.css` files beside it.
- Alternatively, open `splunk-helper-standalone.html`. That version contains all runtime assets in one file and can be shared by itself.
- No installation, account, API key, network connection, or build is required to use the tool.

## Publish to GitHub Pages

1. Open your `Joelwang22/splunker` repository on GitHub.
2. Upload **the files inside this folder** to the repository root. In particular, keep `index.html`, `styles.css`, `core.js`, `content.js`, `app.js`, and `.nojekyll` together. Do not upload just the ZIP.
3. Commit the upload to your main branch.
4. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose your main branch and **/(root)**, then save.
6. Wait for the Pages deployment to finish. The expected project URL is `https://joelwang22.github.io/splunker/`.

The URL is an expected deployment destination, not a claim that deployment has already succeeded. All asset paths are relative, so the page works under the `/splunker/` project path.

If you prefer a one-file deployment, upload `splunk-helper-standalone.html` **renamed to `index.html`** instead. Keep `.nojekyll` beside it. Use either the modular entry point or the standalone entry point; do not accidentally replace the modular index with an outdated generated file.

[Official GitHub Pages instructions](https://docs.github.com/en/pages/quickstart).

## Start learning

1. In **Build**, choose a question and click **Use this starting point**.
2. Change a condition. Watch the generated SPL update.
3. Open **Walk the data** and select **Filter**, then **Group**. Compare the input/output tables, row counts, and fields.
4. On the Filter stage, expand **See how the AND / OR filters fit together**. Each condition starts from the same source/time population; AND keeps the overlap, OR keeps either match.
5. On the Group stage, notice that `stats` replaces individual events with summary rows. Only the grouping fields and metric outputs survive.
6. Copy the query to Splunk, choose an appropriate time range, and compare real results. For your tutorial logs, use **All time** or March 2020 dates.
7. Use **Recipes** for questions, **Reference** for the reasoning and syntax, and **Practice** to write your own searches.

## Features

- Source, index, host, event phrase, and time selectors.
- Explicit AND/OR groups with equal, unequal, numeric, wildcard, IN, exists, and missing conditions.
- Event tables, grouped statistics, ranked values, time trends, and comparison matrices.
- Multiple metrics: count, populated-field count, distinct count, sum, average, min, max, unique values, and conditional count.
- Lookup enrichment, optional custom event stage, safe ratios, post-summary filters, sorting, and row limits.
- Generated SPL with stage explanations, copy, `.spl` download, and print.
- Pipeline inspector with before/after tables, row counts, field changes, and filter match counts.
- Illustrative table/chart output on 48 synthetic access events.
- 26 recipes, 36 command/function entries, 12 search-thinking guides, and 10 exercises.
- Separate manual SPL drafts; switching to the builder preserves your manual draft.
- Browser-local saved searches, library JSON export/import, draft persistence, and practice progress.
- Light/dark themes, responsive layouts, keyboard-accessible controls, tab arrow keys, and reduced-motion support.

## Honest limits

This is a **query composer and teaching tool**, not a Splunk server or a complete SPL parser.

- It never sends queries, saved drafts, or data to Splunk or another service.
- Preview events are synthetic, dated 22–27 March 2020 UTC, and have different totals from the real tutorial dataset.
- Custom expressions and manual SPL are not evaluated. The inspector stops at unsupported stages instead of inventing results.
- The illustrative evaluator handles the supported builder operations. It simplifies dynamic chart series selection, missing time buckets, and raw keyword matching. Keyword matching searches the synthetic event representation, not Splunk's indexed `_raw` tokenization.
- Sample product names/prices are treated as already supplied by an automatic lookup. Explicit `OUTPUTNEW` enrichment therefore leaves those populated values unchanged in the inspector.
- The builder catches selected construction mistakes, not every SPL syntax or semantic error. Run the query in Splunk for authoritative results.
- Practice checks look for ingredients and selected ordering mistakes. They are not a correctness grade; progress is self-assessed.
- Incident-response recipes use placeholder indexes and field names that you must map to your environment.
- Ratios of event counts are not necessarily user-cohort conversion rates. Summed regular lookup prices are estimates, not actual revenue.
- Basic syntax targets classic SPL as used in the user's Splunk 7.3 lab. Official reference pages may describe newer releases; this is not SPL2.

Local storage belongs to the current browser/profile/origin. Moving between `file://`, localhost, and GitHub Pages can show different saved libraries. Export a JSON backup first. Restricted/private browsers may block persistence; export remains available.

## Development and verification

Runtime files are plain HTML/CSS/JS. Pure compiler and demonstration logic live in `core.js`; teaching content is in `content.js`; DOM/persistence logic is in `app.js`.

For optional developer tests, use Node 22.8+:

```sh
npm install
npm test
npm run standalone
```

`jsdom` is a **development-only** dependency. It is not required by the published site. Tests cover query construction, quoting, filter grouping, null handling, aggregation field survival, dates, imports, manual drafts, library rendering, modes, pipeline steps, keyboard tabs, recipes, and exercises.

The standalone command regenerates `splunk-helper-standalone.html` from the source files. Run it after source changes if you publish or share that file.

Verification in the authoring session: compiler and DOM interaction tests passed. Native/headless browser launch was unavailable in the sandbox, so real desktop/mobile visual rendering was **not** verified. Inspect the page in your browser before publishing if you want to check its appearance on your device. No live searches were executed against Splunk.

## Files

| File | Purpose |
|---|---|
| `index.html` | Modular page entry point |
| `styles.css` | Layout, themes, responsive rules |
| `core.js` | Query compilation and illustrative transformations |
| `content.js` | Recipes, lessons, commands, exercises |
| `app.js` | UI, saved drafts, import/export |
| `splunk-helper-standalone.html` | Generated single-file version |
| `.nojekyll` | Serve as a plain static GitHub Pages site |
| `tests/` | Developer tests |
| `scripts/standalone.cjs` | Create the standalone version |

No analytics, CDN assets, external fonts, or runtime libraries are included.
