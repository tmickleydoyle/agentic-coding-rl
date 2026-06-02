# Build a Dev Handoff Checklist app

Build a complete single-page React application — a developer handoff checklist tool — with **three views** the user navigates between using a top navigation bar: **Checklist**, **Summary**, and **Settings**. The app starts on the Checklist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Checklist**, **Summary**, **Settings**) switches the active view.

**Checklist** — the main list of handoff items.
- An input labeled **New item** plus an **Add item** button adds a checklist item (ignore a blank title). New items start as not done.
- Each item shows its title and a **Mark done** / **Mark undone** toggle button. If the item is not done, show a **Mark done** button; if done, show a **Mark undone** button.
- A heading shows **Remaining: N** where N is the number of items not yet done.
- Each item also has a **Delete** button that removes it entirely from the list.
- A filter control: a set of three buttons labeled **All**, **Done**, and **Pending** that filter which items are shown (default: **All**). The filter persists when navigating away and back.

**Summary** — a read-only derived view:
- Shows the following text lines: `Total: N`, `Done: N`, `Pending: N`, and `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, persisting across views.

Seed the app with these three initial items (all not done): **Write README**, **Record demo video**, **Deploy to staging**.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
