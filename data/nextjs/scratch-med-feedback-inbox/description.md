# Build a Feedback Inbox app

Build a complete single-page React application — a lightweight feedback management tool — with **three views** the user navigates between using a top navigation bar: **Inbox**, **Stats**, and **Settings**. The app starts on the Inbox. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Inbox**, **Stats**, **Settings**) switches the active view.

**Inbox** — a list of feedback items.
- An input labeled **Note** for the feedback text, a select labeled **Theme** with options **Bug**, **Feature**, **UX**, and **Other**, and an **Add feedback** button. Submitting with a blank note is ignored.
- After adding, the inputs reset to empty note and **Bug** as the selected theme.
- Each feedback item shows its note text, its theme, and its upvote count formatted as `Upvotes: N`.
- Each item has an **Upvote** button that increments that item's upvote count by 1.
- A select labeled **Sort by** with options **Newest** and **Most upvoted** controls the display order. **Newest** shows items most-recently-added first. **Most upvoted** shows items sorted by upvote count descending (ties keep their relative order).
- The total number of feedback items is shown as `Total feedback: N`.

**Stats** — a read-only derived summary:
- `Total: N` — total number of feedback items.
- `Bug: N`, `Feature: N`, `UX: N`, `Other: N` — count of items per theme.
- `Top upvotes: N` — the highest upvote count among all items (0 when there are no items).
- `Total upvotes: N` — sum of all upvote counts.

**Settings**
- A **Toggle theme** button that switches the UI between light and dark mode. The current mode is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists across navigation.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs. Routing is in-app state only.
