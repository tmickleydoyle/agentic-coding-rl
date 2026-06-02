# Build a Dev Handoff Checklist App

Build a complete single-page React application — a dev handoff checklist tool — with **three views** the user navigates between using a top navigation bar: **Checklist**, **Summary**, and **Settings**. The app starts on the Checklist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Checklist**, **Summary**, **Settings**) switches the active view.

**Checklist** — a list of handoff items with a done toggle.
- An input labeled **New item** plus an **Add item** button adds a checklist item (ignore a blank title). New items start as not done.
- Each item shows its title and a checkbox labeled **Done** (or named after the item title, e.g. `Mark <title> as done`). Checking the box marks it done; unchecking marks it not done.
- A button labeled **Remove** next to each item deletes it entirely.
- Above the list, show a live progress line in the exact format: `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no items).
- Also show a live count line in the exact format: `Remaining: N` where N is the number of items not yet done.
- Seed the app with these three initial items already in the list (all starting as not done): **Write release notes**, **Update API docs**, **Tag the release**.

**Summary** — a read-only dashboard computed from the checklist, shown as text lines:
`Total items: N`, `Done: N`, `Remaining: N`, and `Completion: P%` where P is computed the same way as on the Checklist view.

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.
- A **Clear all** button that removes every checklist item entirely (leaves an empty list).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
