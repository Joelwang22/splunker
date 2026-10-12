# Design and implementation

User-approved scope: a thorough browser-only Splunk query composer and learning tool, prepared for GitHub Pages.

Interface: Build, Recipes, Reference, and Practice. Builder contains explicit source/time, grouped event filters, output type and metrics, optional enrichment/calculation, and result shaping. Adjacent query pane offers editable SPL, explanation and honest preview on fixed synthetic Buttercup events. Editing switches to manual mode; it never pretends to parse or execute arbitrary SPL. Recipe queries can be copied or opened in manual mode; supported presets can populate the builder.

Files: index.html, styles.css, core.js (pure compiler/preview), content.js (learning material), app.js (DOM/persistence), tests/core.test.cjs, README.md, .nojekyll. All asset URLs relative. No runtime network dependencies.

Visual direction: a quiet study workbench with warm paper surfaces, deep ink query pane, teal controls, generous reading space, and precise step labels. UI font uses the platform stack for a native tool; monospace only for code and data. Responsive two-column builder becomes one column on small screens. Visible focus, semantic labels, reduced motion, no decorative imagery.

Verification: tests for escaping/injection-like values, grouped filter semantics, invalid metrics, source/time behavior, post-summary filtering, output columns, sample aggregation, null behavior, import sanitation; browser checks for builder, manual mode, recipes, practice, local saving, desktop/mobile, and absence of overflow. Document limits rather than claiming full SPL validation.

Plan: 1. Write core contract tests and observe missing implementation failure. 2. Implement compiler and safe illustrative evaluator. 3. Add teaching content and UI. 4. Verify core and browser workflows. 5. Package deployment files and publishing instructions. Execution is inline as authorized by the user's request to build the approved design.
