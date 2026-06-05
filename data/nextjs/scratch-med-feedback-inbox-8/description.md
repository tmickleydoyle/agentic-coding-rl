# Build a Feedback Inbox app

Build a complete single-page React application — a lightweight feedback management tool — with **three views** the user navigates between using a top navigation bar: **Inbox**, **Stats**, and **Settings**. The app starts on the Inbox. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Inbox**, **Stats**, **Settings**) switches the active view.

**Inbox** — a list of feedback items, each with a note, a theme, and an upvote count.
- An input labeled **Note** for the feedback text.
- A `<select>` labeled **Theme** with options: **Bug**, **Feature**, **UX**, **Performance**.
- An **Add feedback** button that appends the item (ignore blank note). New items start with 0 upvotes.
- Each feedback item shows its note, its theme (in parentheses), its upvote count formatted as `Upvotes: N`, and an **Upvote** button that increments its count by 1.
- A **Sort by upvotes** button sorts the visible list in descending order by upvote count (highest first). The sort is a one-time reorder applied immediately and persists until new feedback is added or another sort is triggered.
- Duplicate notes with different themes are allowed.

**Stats** — a read-only summary derived from the Inbox data:
- Shows the total number of feedback items as `Total feedback: N`.
- Shows the total upvotes across all items as `Total upvotes: N`.
- For each theme that has at least one item, shows a line formatted as `Bug: N`, `Feature: N`, `UX: N`, `Performance: N` (count of items per theme).
- Shows the theme with the most items as `Top theme: <name>` (if there are no items, show `Top theme: None`).

**Settings**
- A **Toggle theme** button switches the UI theme between light and dark. The current theme is reflected as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Clear all feedback** button removes every feedback item from the Inbox (the list becomes empty and Stats resets to zero).

Seed the app with **no initial feedback items** — the list starts empty.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
