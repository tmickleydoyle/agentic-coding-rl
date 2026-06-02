# Build a Dev Handoff Checklist app

Build a complete single-page React application — a developer handoff checklist tool — with **three views** the user navigates between using a top navigation bar: **Checklist**, **Summary**, and **Settings**. The app starts on the Checklist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Checklist**, **Summary**, **Settings**) switches the active view.

**Checklist** — a list of handoff items with done toggles.
- An input labeled **New item** plus an **Add item** button adds a new checklist item (ignore a blank title). New items start as not done.
- Each item shows its title and a checkbox labeled **Done** that toggles its completion state.
- A heading shows **Remaining: N** where N is the count of items that are not yet done.
- Items that are done should be visually marked but remain in the list unless filtered.
- When the **Hide done** toggle (a checkbox labeled **Hide done**) is checked, completed items are hidden from the list (they still count in Summary).

**Summary** — a read-only derived view:
- Shows `Total items: N`, `Done: N`, `Remaining: N`, and `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.
- A **Reset checklist** button clears all items from the list.

Seed the app with these three default items (all starting as not done):
1. Write unit tests
2. Update README
3. Tag release

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
