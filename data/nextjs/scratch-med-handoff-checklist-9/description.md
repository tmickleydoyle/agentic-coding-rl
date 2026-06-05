# Build a dev-handoff checklist app

Build a complete single-page React application — a developer handoff checklist tool — with **three views** the user navigates between using a top navigation bar: **Checklist**, **Summary**, and **Settings**. The app starts on the Checklist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Checklist**, **Summary**, **Settings**) switches the active view.

**Checklist** — a list of handoff items with done toggles.
- An input labeled **New item** plus an **Add item** button adds a checklist item (ignore a blank title). New items start as not done.
- Each item shows its title and a checkbox labeled **Done** (or uses the item title as the label) that toggles the item between done and not done.
- A line at the top of the view shows `Remaining: N` where N is the count of items that are NOT done.
- A **Clear done** button removes all completed items from the list (items that are done). If there are no completed items the button is still shown but has no effect.
- Items are listed in the order they were added.

**Summary** — a read-only derived view:
- Shows `Total: N`, `Done: N`, `Remaining: N`, and `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists as the user navigates between views.
- A **Show only remaining** checkbox; when checked, the Checklist view shows only items that are NOT done (done items are hidden from the list but still counted in the Summary).

Seed the app with these three initial items (all not done): **Write README**, **Record demo video**, **Update staging env**.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
