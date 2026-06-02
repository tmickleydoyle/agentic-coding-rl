# Build a Product Roadmap Board

Build a complete single-page React application — a lightweight product roadmap tool — with **three views** the user navigates between using a top navigation bar: **Roadmap**, **Stats**, and **Settings**. The app starts on the Roadmap view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Roadmap**, **Stats**, **Settings**) switches the active view.

**Roadmap** — the main list of roadmap items.
- An input labeled **Item title** and a dropdown labeled **Quarter** (options: `Q1`, `Q2`, `Q3`, `Q4`) and a dropdown labeled **Status** (options: `planned`, `in-progress`, `shipped`) plus an **Add item** button adds a new roadmap item (ignore a blank title).
- Each item in the list shows its title, quarter, and status.
- A filter dropdown labeled **Filter by quarter** with options `All`, `Q1`, `Q2`, `Q3`, `Q4` filters the displayed list. When a quarter filter is active, only items for that quarter are shown. When set to `All`, all items are shown.
- Each item has a **Ship it** button that sets its status to `shipped` (the button is disabled if the item is already `shipped`).
- The total count of currently visible items is shown as `Showing: N items`.
- The count of shipped items among visible items is shown as `Shipped: N`.

**Stats** — a read-only summary computed from ALL items (not affected by the quarter filter):
- `Total items: N`
- `Planned: N`
- `In Progress: N`
- `Shipped: N`
- `Shipped rate: P%` where P is shipped ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view navigation.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with NO initial items so the empty state is testable.
