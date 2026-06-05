# Build a Feedback Inbox app

Build a complete single-page React application — a lightweight feedback management tool — with **three views** the user navigates between using a top navigation bar: **Inbox**, **Stats**, and **Settings**. The app starts on the Inbox view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Inbox**, **Stats**, **Settings**) switches the active view.

**Inbox** — a list of feedback items.
- An input labeled **Note** for the feedback text, a select labeled **Theme** with options **Bug**, **Feature**, **UX**, and **Other**, plus an **Add feedback** button. Submitting with a blank Note is ignored.
- Each feedback item shows its note text, its theme tag, and its upvote count formatted as `Upvotes: N`.
- Each item has an **Upvote** button that increments its upvote count by 1.
- A select labeled **Sort by** with options **Newest** and **Most upvoted**. When **Most upvoted** is selected the list is sorted descending by upvote count; when **Newest** the list is in insertion order (most recently added last, i.e. newest at bottom).
- A summary line at the top of the list shows `Total feedback: N` where N is the total number of items.

**Stats** — a read-only derived summary.
- Shows `Total: N` for the overall count.
- Shows one line per theme (always all four in this order: Bug, Feature, UX, Other) formatted as `Bug: N`, `Feature: N`, `UX: N`, `Other: N`.
- Shows `Top theme: T` where T is the theme name with the most items (if tied, pick the one that appears first in the Bug → Feature → UX → Other order). When there are no items, show `Top theme: None`.

**Settings**
- A **Toggle theme** button that switches the UI between light and dark mode. The current mode is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.

Seed the app with **no initial items** (empty state). Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
