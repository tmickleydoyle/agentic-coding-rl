# Build a product roadmap app

Build a complete single-page React application — a lightweight product roadmap tool — with **three views** the user navigates between using a top navigation bar: **Roadmap**, **Stats**, and **Settings**. The app starts on the Roadmap view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Roadmap**, **Stats**, **Settings**) switches the active view.

**Roadmap** — a list of roadmap items.
- An input labeled **Item title** and a dropdown (select) labeled **Quarter** (options: `Q1`, `Q2`, `Q3`, `Q4`) and a dropdown labeled **Status** (options: `planned`, `in-progress`, `shipped`) plus an **Add item** button adds a new roadmap item (ignore a blank title).
- Each item shows its title, quarter, and status in the list.
- Each item has a **Ship** button that changes its status to `shipped` (the button is disabled if the item is already `shipped`).
- A dropdown labeled **Filter by quarter** with options `All`, `Q1`, `Q2`, `Q3`, `Q4` filters the list to show only items for that quarter (or all items when `All` is selected). The filter persists when navigating away and back.
- The heading above the list reads `Items (N)` where N is the count of currently displayed (filtered) items.

**Stats** — a read-only summary derived from all roadmap items (unaffected by the quarter filter):
- `Total items: N`
- `Planned: N`
- `In Progress: N`
- `Shipped: N`
- `Shipped: P%` where P is shipped ÷ total as a whole-number percent (0% when there are no items) — shown as `Shipped rate: P%`

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Seed the app with these three items already present on first render:
- Title: `Dark mode support`, Quarter: `Q1`, Status: `planned`
- Title: `API rate limiting`, Quarter: `Q2`, Status: `in-progress`
- Title: `CSV export`, Quarter: `Q1`, Status: `shipped`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
