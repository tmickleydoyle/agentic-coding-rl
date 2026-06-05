# Build a Dev Handoff Checklist app

Build a complete single-page React application — a developer handoff checklist tool — with **three views** the user navigates between using a top navigation bar: **Checklist**, **Summary**, and **Settings**. The app starts on the Checklist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Checklist**, **Summary**, **Settings**) switches the active view.

**Checklist** — the main task list view.
- An input labeled **New item** plus an **Add item** button adds a checklist item (ignore a blank title). New items start as not done.
- Each item shows its title and a **Mark done** / **Mark undone** toggle button: if the item is not done, show **Mark done**; if done, show **Mark undone**.
- Each item also has a **Remove** button that deletes it permanently.
- A live status line shows: `Remaining: N` where N is the count of items not yet done.
- A live completion line shows: `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no items).

**Summary** — a read-only derived summary showing:
- `Total items: N`
- `Done: N`
- `Remaining: N`
- `Completion: P%` (same formula as above)

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.
- A **Show done items** checkbox; when unchecked, completed items are hidden from the Checklist view (they still count in Summary).

Seed the app with these three starter items (in order, all not done): **Write documentation**, **Record demo video**, **Hand off credentials**.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
