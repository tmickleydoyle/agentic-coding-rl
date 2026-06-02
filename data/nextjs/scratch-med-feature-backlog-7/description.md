# Build a Feature Backlog app

Build a complete single-page React application — a lightweight internal product backlog tool — with **three views** the user navigates between using a top navigation bar: **Backlog**, **Stats**, and **Settings**. The app starts on the Backlog view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Backlog**, **Stats**, **Settings**) switches the active view.

**Backlog** — the main list of feature requests.
- An input labeled **Feature title** and a dropdown labeled **Priority** (options: **P0**, **P1**, **P2**) and a dropdown labeled **Status** (options: **idea**, **building**, **shipped**) plus an **Add feature** button adds a new feature (ignore a blank title).
- Each feature row shows its title, priority badge, and status. Each row also has a **Delete** button that removes it.
- A filter dropdown labeled **Filter by priority** with options **All**, **P0**, **P1**, **P2** filters the list. When a filter is active only matching rows are shown, but all features still count in Stats.
- The heading above the list reads `Features (N)` where N is the number of currently **visible** items after filtering.

**Stats** — a read-only derived summary:
- `Total: N` — total number of features across all priorities.
- `P0: N` — count of P0 features.
- `P1: N` — count of P1 features.
- `P2: N` — count of P2 features.
- `Shipped: N` — count of features with status shipped.
- `Completion: P%` — shipped ÷ total as a whole-number percent (0% when there are no features).

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view navigation.

Seed the app with **no** initial features (empty list).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
