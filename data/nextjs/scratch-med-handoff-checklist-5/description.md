# Build a dev-handoff checklist app

Build a complete single-page React application — a developer handoff checklist tool — with **three views** the user navigates between using a top navigation bar: **Checklist**, **Summary**, and **Settings**. The app starts on the Checklist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Checklist**, **Summary**, **Settings**) switches the active view.

**Checklist** — the main view for managing handoff items.
- An input labeled **New item** plus an **Add item** button adds a checklist item (ignore a blank title). New items start as not done.
- Each item shows its title and a **Mark done** / **Mark undone** toggle button. If the item is done, the button reads **Mark undone**; otherwise it reads **Mark done**.
- A **Filter** control (a `<select>` with accessible label **Filter**) lets the user filter the visible list. Options are **All**, **Done**, and **Remaining**. Default is **All**.
- Below the list, show the live counts as: `Remaining: N` and `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no items). These lines are always visible regardless of the filter.
- Each item also has a **Delete** button that removes it permanently.

**Summary** — a read-only derived view:
- Shows the lines: `Total items: N`, `Done: N`, `Remaining: N`, and `Completion: P%` (same rounding rule). All values are computed live from the shared checklist state.

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.
- A **Clear all items** button removes every item from the checklist. After clearing, the counts reset to zero.

Seed the app with these three items already present (in this order): **"Write release notes"** (not done), **"Update README"** (not done), **"Tag the release"** (not done).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
