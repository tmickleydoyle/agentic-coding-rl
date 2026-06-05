# Build a Dev Handoff Checklist app

Build a complete single-page React application — a developer handoff checklist tool — with **three views** the user navigates between using a top navigation bar: **Checklist**, **Summary**, and **Settings**. The app starts on the Checklist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Checklist**, **Summary**, **Settings**) switches the active view.

**Checklist** — the main list of handoff items.
- An input labeled **New item** plus an **Add item** button adds a checklist item (ignore a blank title). New items start as not done.
- Each item shows its title and a **Mark done** / **Mark undone** toggle button. If the item is done, the button reads **Mark undone**; otherwise it reads **Mark done**.
- A heading shows the remaining count: `Remaining: N` where N is the number of items not yet done.
- Each item also has a **Delete** button that removes it permanently.
- A **Filter** control (a `<select>` labeled **Filter**) with options **All**, **Done**, and **Pending** filters the visible list without affecting counts or the Summary.

**Summary** — a read-only derived view:
- Shows `Total: N`, `Done: N`, `Pending: N`, and `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Seed the app with these three initial items (all not done): **Write README**, **Record demo video**, **Archive repo**.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
