# Build a Dev Handoff Checklist app

Build a complete single-page React application — a developer handoff checklist tool — with **three views** the user navigates between using a top navigation bar: **Checklist**, **Summary**, and **Settings**. The app starts on the Checklist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Checklist**, **Summary**, **Settings**) switches the active view.

**Checklist** — the main list of handoff items.
- An input labeled **New item** plus an **Add item** button adds a checklist item (ignore a blank title).
- Each item shows its title and a checkbox labeled **Done** that toggles the item's completion state.
- Each item also has a **Remove** button that deletes it from the list.
- At the top of the view, show a live progress line in the exact format: `Completion: P%` where P is the number of done items divided by total items as a whole-number percent (show `Completion: 0%` when there are no items or none are done).
- Also show a live count line in the exact format: `Remaining: N` where N is the number of items not yet done.

**Summary** — a read-only derived view showing:
- `Total items: N`
- `Done: N`
- `Remaining: N`
- `Completion: P%` (same rounding rule as above)

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.
- A **Clear all** button that removes every checklist item (resets the list to empty).

Seed the app with these three initial items (all undone):
1. Write API documentation
2. Update environment variables
3. Tag release version

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).