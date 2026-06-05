# Build a Feedback Inbox app

Build a complete single-page React application — a feedback management tool for a small product team — with **three views** the user navigates between using a top navigation bar: **Inbox**, **Stats**, and **Settings**. The app starts on the Inbox. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Inbox**, **Stats**, **Settings**) switches the active view.

**Inbox** — a list of feedback items.
- An input labeled **Note** for the feedback text, a dropdown (select) labeled **Theme** with options **Bug**, **Feature**, **UX**, and an **Add feedback** button. Ignore a blank note.
- Each feedback item displays its note, its theme (as a badge/label), its current upvote count (starting at 0), and an **Upvote** button that increments that item's count by 1.
- A dropdown labeled **Sort by** with options **Newest** (default, insertion order reversed — most recent first) and **Most upvoted** (highest upvotes first). Changing the sort updates the displayed order immediately.
- The total item count appears as a heading: `Feedback (N)` where N is the number of items.

**Stats** — a read-only summary derived from the Inbox data:
- Text line: `Total feedback: N`
- One line per theme showing how many items belong to it, e.g. `Bug: N`, `Feature: N`, `UX: N`
- Text line: `Total upvotes: N` (sum of all upvote counts)
- Text line: `Top theme: <theme name>` showing the theme with the most items (if tied or no items, show `Top theme: None`)

**Settings**
- A **Toggle theme** button that switches the UI theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
