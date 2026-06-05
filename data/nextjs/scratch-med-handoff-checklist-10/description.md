# Build a Dev Handoff Checklist App

Build a complete single-page React application — a developer handoff checklist tool — with **three views** the user navigates between using a top navigation bar: **Checklist**, **Summary**, and **Settings**. The app starts on the Checklist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Checklist**, **Summary**, **Settings**) switches the active view.

**Checklist** — a list of handoff items with done toggles.
- An input labeled **New item** plus an **Add item** button adds a checklist item (ignore a blank title). New items start as not done.
- Each item shows its title and a checkbox labeled **Done** (or the item title as the accessible name, e.g. `Mark <title> done`) that toggles its done state.
- A button labeled **Clear done** removes all completed items from the list.
- The heading shows **Checklist** and a live count of remaining (not-done) items: `Remaining: N`.

**Summary** — a read-only stats view computed from the checklist:
- `Total: N` — total number of items
- `Done: N` — number of completed items
- `Remaining: N` — number of not-done items
- `Completion: P%` — done ÷ total as a whole-number percent (0% when there are no items)

**Settings**
- A **Toggle theme** button that switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates.
- A **Show done items** checkbox; when unchecked, completed items are hidden on the Checklist view (they still count in Summary).

Seed the app with these three initial items (all not done): **Write README**, **Record demo video**, **Hand off credentials**.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
