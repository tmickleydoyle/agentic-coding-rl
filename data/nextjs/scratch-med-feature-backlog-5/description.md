# Build a Feature Backlog app

Build a complete single-page React application — a lightweight feature backlog tool for a small product team — with **three views** the user navigates between using a top navigation bar: **Backlog**, **Stats**, and **Settings**. The app starts on the Backlog view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Backlog**, **Stats**, **Settings**) switches the active view.

**Backlog** — the main list of feature requests.
- An input labeled **Feature title** plus an **Add feature** button adds a new feature (ignore a blank title). New features default to priority **P1** and status **idea**.
- Each feature shows its title, priority, and status.
- A **Priority** select (options **P0**, **P1**, **P2**) and a **Status** select (options **idea**, **building**, **shipped**) let the user change those fields per feature.
- A filter control: a **Filter by priority** select with options **All**, **P0**, **P1**, **P2**. When a priority is selected only features with that priority are shown. The filter does NOT affect counts in Stats.
- Each feature has a **Delete** button that removes it permanently.
- The heading shows the count of currently visible features: `Features (N)` where N reflects the active filter.

**Stats** — a read-only summary computed from ALL features (unfiltered):
- `Total: N`
- `P0: N`, `P1: N`, `P2: N`
- `Idea: N`, `Building: N`, `Shipped: N`
- `Shipped: P%` where P is shipped ÷ total as a whole-number percent (0% when there are no features). Display this line as `Shipped rate: P%`.

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the app with NO features on first load (empty state).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
