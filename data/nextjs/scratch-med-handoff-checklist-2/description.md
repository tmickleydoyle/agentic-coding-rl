# Build a Dev Handoff Checklist app

Build a complete single-page React application — a developer handoff checklist tool — with **three views** the user navigates between using a top navigation bar: **Checklist**, **Summary**, and **Settings**. The app starts on the Checklist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Checklist**, **Summary**, **Settings**) switches the active view.

**Checklist** — the main list of handoff items.
- An input labeled **New item** plus an **Add item** button adds a new checklist item (ignore a blank title). New items start as not done.
- Each item shows its title and a checkbox labeled **Done** that toggles its completion state.
- A button labeled **Remove** next to each item deletes it from the list.
- Above the list, show the count of remaining incomplete items as `Remaining: N`.
- Below (or above) the list show completion percentage as `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no items).

**Summary** — a read-only derived stats view:
- Shows `Total items: N`
- Shows `Completed: N`
- Shows `Remaining: N`
- Shows `Completion: P%` (same formula — whole-number percent, 0% when empty)

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Clear completed** button that removes all completed items from the checklist.

Seed the app with these three initial items (all not done): **Write README**, **Update API docs**, **Record demo video**.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
