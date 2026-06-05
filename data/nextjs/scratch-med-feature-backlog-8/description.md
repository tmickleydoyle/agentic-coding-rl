# Build a Feature Backlog app

Build a complete single-page React application — a feature backlog tracker — with **three views** the user navigates between using a top navigation bar: **Backlog**, **Stats**, and **Settings**. The app starts on the Backlog view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Backlog**, **Stats**, **Settings**) switches the active view.

**Backlog** — a list of feature items.
- An input labeled **Feature title** plus an **Add feature** button adds a new feature (ignore a blank title). New features default to priority **P1** and status **idea**.
- Each feature row shows its title, a **Priority** select with options **P0**, **P1**, **P2**, and a **Status** select with options **idea**, **building**, **shipped**.
- A filter bar has a **Filter by priority** select with options **All**, **P0**, **P1**, **P2** and a **Filter by status** select with options **All**, **idea**, **building**, **shipped**. Both filters apply simultaneously. When a filter is active, only matching rows are shown.
- A count line below the filters reads `Showing: N of M` where N is visible count and M is total count.
- Each feature row has a **Delete** button that removes it permanently.

**Stats** — a read-only derived summary:
- `Total features: N`
- `P0: N`, `P1: N`, `P2: N` (counts by priority across all features regardless of filter)
- `Idea: N`, `Building: N`, `Shipped: N` (counts by status across all features)
- `Shipped rate: P%` where P is shipped ÷ total as a whole-number percent (0% when there are no features)

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
