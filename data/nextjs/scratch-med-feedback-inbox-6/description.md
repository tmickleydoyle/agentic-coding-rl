# Build a Feedback Inbox app

Build a complete single-page React application — a lightweight feedback management tool — with **three views** the user navigates between using a top navigation bar: **Inbox**, **Stats**, and **Settings**. The app starts on the Inbox view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Inbox**, **Stats**, **Settings**) switches the active view.

**Inbox** — the main list of feedback items.
- An input labeled **Note** for the feedback text.
- A `<select>` labeled **Theme** with four options: **Bug**, **Feature**, **UX**, **Other**.
- An **Add feedback** button that adds the item (ignore blank notes). After adding, clear the Note input and reset the Theme select to **Bug**.
- Each feedback item shows its note text, its theme as a badge (e.g. `[Bug]`), and its upvote count formatted as `Upvotes: N`.
- Each item has an **Upvote** button that increments its upvote count by 1.
- A sort control: a `<select>` labeled **Sort by** with two options: **Date added** (insertion order, newest first) and **Upvotes** (highest first). Switching the sort re-orders the displayed list without changing the underlying data.
- A **Clear all** button that removes every feedback item.

**Stats** — a read-only derived summary (computed from the Inbox data):
- `Total feedback: N` — total number of items.
- One count line per theme, always shown in this order: `Bug: N`, `Feature: N`, `UX: N`, `Other: N`.
- `Top theme: <name>` — the theme with the highest count; if there are no items, show `Top theme: None`.
- `Total upvotes: N` — sum of all upvote counts.

**Settings**
- A **Toggle theme** button that switches the UI theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Seed the app with **no initial data** (empty inbox).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
