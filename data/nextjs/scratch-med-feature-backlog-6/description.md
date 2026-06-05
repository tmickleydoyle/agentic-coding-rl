# Build a Feature Backlog app

Build a complete single-page React application — a lightweight internal feature backlog tool — with **three views** the user navigates between using a top navigation bar: **Backlog**, **Stats**, and **Settings**. The app starts on the Backlog view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Backlog**, **Stats**, **Settings**) switches the active view.

**Backlog** — a filterable list of feature requests.
- An input labeled **Feature title** and a dropdown labeled **Priority** (options: `P0`, `P1`, `P2`) and a dropdown labeled **Status** (options: `idea`, `building`, `shipped`) plus an **Add feature** button adds a new feature (ignore a blank title).
- Each feature row shows its title, its priority badge, and its status badge.
- Above the list, a row of filter buttons: **All**, **P0**, **P1**, **P2** — clicking one filters the visible list to only features matching that priority (All shows everything).
- A count line beneath the filter buttons shows the number of visible items, formatted as `Showing: N features`.
- Each feature row has a **Delete** button that removes it permanently.
- Each feature row has a **Status** dropdown (same options: `idea`, `building`, `shipped`) that updates the feature's status in place.

**Stats** — a read-only summary, derived from the full unfiltered list:
- `Total features: N`
- `P0: N`, `P1: N`, `P2: N` (one line each)
- `Shipped: N`
- `Completion: P%` where P is the number of shipped features divided by total features, as a whole-number percent (0% when there are no features).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is stored as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Clear all features** button that removes every feature from the backlog.

Seed the app with **no features** on first load. Use only `react` and `react-dom` — no other libraries, no Next.js APIs. Implement the root component as the default export of `app/page.tsx`.
