# Interface system

The page is a study workbench: editing controls on the left and the query/data inspection area on the right. On smaller screens the query pane comes first so the current answer remains easy to find. Recipes and practice use a selectable list with a reading/work area. Reference material favors prose, code and tables.

## Visual tokens

- Paper background: `#f5f4ee`; surface: `#fffefa`; body text: `#233531`.
- Teal action color: `#17665a`; muted teal surface: `#e6f0e9`.
- Query editor: `#142a2b` / `#102324`, with light code text.
- Native UI font stack; Consolas/SFMono-Regular for actual code, fields and counts.
- Controls use 5–6px radii; work areas use 10–12px radii. Borders define surfaces without decorative shadows.
- Dark theme changes surface, text and accent tokens; query pane remains dark.

## Learning interaction

The query remains visible while the user modifies sources, filter groups and output shape. Pipeline stage buttons select a before/after comparison on synthetic events. Row totals distinguish filtering from aggregation; field chips distinguish retained and created fields, with removed fields visibly struck through. Filter audit counts evaluate each condition against the same source/time population so AND overlap and OR union are understandable.

Manual editing is separate from the generated builder. It never claims to parse or execute arbitrary SPL. Unsupported custom expressions stop the illustrative inspector.

## Accessibility and responsive behavior

Semantic headings and labels, visible focus, skip link, read-only query identification, live diagnostics, arrow-key tab navigation, horizontal table scroll, reduced-motion support and a single-column layout below 850px. Layout CSS is prepared for desktop/mobile, but visual browser verification was unavailable in the authoring environment. Automated DOM tests do not substitute for a rendered appearance check.
