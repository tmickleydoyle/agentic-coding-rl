# Build a Feedback Inbox app

Build a complete single-page React application — a lightweight feedback management tool — with **three views** the user navigates between using a top navigation bar: **Inbox**, **Stats**, and **Settings**. The app starts on the Inbox. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Inbox**, **Stats**, **Settings**) switches the active view.

**Inbox** — a list of feedback entries.
- An input labeled **Note** for the feedback text.
- A `<select>` labeled **Theme** with options: **Bug**, **Feature**, **UX**, **Other**.
- An **Add feedback** button that adds the entry (ignore if Note is blank). New entries start with 0 upvotes.
- Each entry shows its note text, its theme (e.g. `Theme: Bug`), its upvote count (e.g. `Upvotes: 3`), and an **Upvote** button that increments its count by 1.
- A `<select>` labeled **Sort by** with options **Newest first** and **Most upvoted**. When **Most upvoted** is selected, entries are re-ordered by upvote count descending; **Newest first** shows the most recently added entry at the top.
- A **Delete** button on each entry removes it.

**Stats** — a read-only summary computed from the current entries:
- `Total feedback: N`
- One count line per theme in this order — `Bug: N`, `Feature: N`, `UX: N`, `Other: N`
- `Total upvotes: N`
- `Top theme: <name>` showing the theme with the most entries (if there are no entries show `Top theme: —`; if there is a tie, pick whichever theme comes first in the order Bug → Feature → UX → Other).

**Settings**
- A **Toggle theme** button that switches the UI theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Seed the app with these three entries (in order, oldest first) so tests have data to work with:
1. Note: `Login page is broken`, Theme: `Bug`, Upvotes: `5`
2. Note: `Add dark mode`, Theme: `Feature`, Upvotes: `3`
3. Note: `Button too small`, Theme: `UX`, Upvotes: `7`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
