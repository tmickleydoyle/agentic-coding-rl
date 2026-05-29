# Tab component

Implement a client component `Tabs` in `components/Tabs.tsx` that:

- Accepts a prop `tabs: { label: string; content: string }[]`.
- Renders each label as a `<button>` with `role="tab"` and `data-testid="tab-<label>"`
  (e.g., `data-testid="tab-Overview"` for label "Overview").
- Renders the active tab's `content` inside an element with `data-testid="panel"`.
- The first tab is active by default; clicking a tab makes it active.
- The active tab's button must have `aria-selected="true"`; all others must have
  `aria-selected="false"`.

Edge case: if `tabs` is an empty array, render nothing inside the panel (the
`data-testid="panel"` element should still exist but be empty). Default export.
