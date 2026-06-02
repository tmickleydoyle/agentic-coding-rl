# Build a Feedback Inbox app

Build a complete single-page React application — a lightweight internal feedback tracker — with **three views** the user navigates between using a top navigation bar: **Inbox**, **Stats**, and **Settings**. The app starts on the Inbox view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Inbox**, **Stats**, **Settings**) switches the active view.

**Inbox** — the main list of feedback items.
- An input labeled **Note** for the feedback text, a select labeled **Theme** with options **Bug**, **Feature**, **UX**, and **Other**, plus an **Add feedback** button. Ignore submissions where Note is blank.
- Each feedback item shows its note text, its theme tag, its upvote count starting at 0, and an **Upvote** button that increments that item's count by 1.
- The list is always sorted by upvotes descending (highest first). Items with equal upvotes maintain stable relative order.
- Above the list, show the total item count as `Feedback: N`.

**Stats** — a read-only summary derived from the inbox:
- Show `Total: N` for the overall count.
- Show a count per theme on separate lines: `Bug: N`, `Feature: N`, `UX: N`, `Other: N`.
- Show the note text of the single highest-upvoted item as `Top item: <note>`. When there are no items, show `Top item: none`.

**Settings**
- A **Toggle theme** button that switches the UI between light and dark mode. The current mode is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Clear all feedback** button that removes every feedback item. After clearing, `Feedback: 0` should appear on Inbox and all counts on Stats should be 0.

Seed the app with NO initial feedback items. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.