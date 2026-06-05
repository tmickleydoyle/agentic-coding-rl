# Build a Product Roadmap Board

Build a complete single-page React application — a lightweight product roadmap tool — with **three views** the user navigates between using a top navigation bar: **Roadmap**, **Stats**, and **Settings**. The app starts on the Roadmap view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Roadmap**, **Stats**, **Settings**) switches the active view.

**Roadmap** — a list of roadmap items.
- An input labeled **Item title** for the item name, a dropdown labeled **Quarter** with options **Q1**, **Q2**, **Q3**, **Q4**, and a dropdown labeled **Status** with options **planned**, **in-progress**, **shipped**. An **Add item** button adds a new roadmap item (ignore blank titles).
- Each item row shows its title, quarter, and status.
- A filter dropdown labeled **Filter by quarter** with options **All**, **Q1**, **Q2**, **Q3**, **Q4** filters the displayed list (but does NOT remove items from the data).
- Each item has a **Delete** button (aria-label `Delete <title>`) that permanently removes it.
- Each item has a **Mark shipped** button (aria-label `Mark shipped <title>`) that sets its status to **shipped**; this button is disabled if the item is already shipped.
- The total visible item count is shown as `Showing: N items` (updates with the filter).

**Stats** — a read-only summary derived from all items (ignores the quarter filter):
- `Total items: N`
- `Planned: N`
- `In Progress: N`
- `Shipped: N`
- `Shipped %: P%` where P is shipped ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
