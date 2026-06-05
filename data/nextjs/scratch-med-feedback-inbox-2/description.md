# Build a Feedback Inbox app

Build a complete single-page React application — a feedback inbox tool — with **three views** the user navigates between using a top navigation bar: **Inbox**, **Stats**, and **Settings**. The app starts on the Inbox view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Inbox**, **Stats**, **Settings**) switches the active view.

**Inbox** — a list of feedback items, each with a note, a theme, and an upvote count.
- An input labeled **Note** for the feedback text.
- A `<select>` labeled **Theme** with options: **Bug**, **Feature**, **UX**, **Other**.
- An **Add feedback** button that adds the item (ignore blank note). New items start with **0** upvotes.
- Each feedback item shows its note, its theme in parentheses, and its upvote count as `Upvotes: N`.
- Each item has an **Upvote** button that increments its count by 1.
- A **Sort by upvotes** button re-orders the list so the highest-upvoted item appears first (descending). The list keeps that order as new upvotes are added.
- The inbox heading shows the total count: `Inbox (N)`.

**Stats** — a read-only summary derived from the inbox:
- A line `Total feedback: N`.
- For each theme that has at least one item, a line formatted as `Bug: N`, `Feature: N`, `UX: N`, or `Other: N` (only themes with items are shown).
- A line `Most upvoted: TITLE` showing the note of the item with the highest upvote count, or `Most upvoted: —` when the inbox is empty.
- A line `Total upvotes: N` summing all upvote counts.

**Settings**
- A **Toggle theme** button that switches the UI theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Clear all feedback** button that removes every feedback item. After clearing, the inbox is empty and stats reset to zero.

Seed the app with these three items already present on first load:
1. Note: `Login page broken`, Theme: `Bug`, Upvotes: `3`
2. Note: `Add dark mode`, Theme: `Feature`, Upvotes: `5`
3. Note: `Button too small`, Theme: `UX`, Upvotes: `1`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
