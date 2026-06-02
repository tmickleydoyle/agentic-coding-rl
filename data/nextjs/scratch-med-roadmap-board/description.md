# Build a Product Roadmap Board

Build a complete single-page React application — a lightweight product roadmap tool — with **three views** the user navigates between using a top navigation bar: **Roadmap**, **Stats**, and **Settings**. The app starts on the Roadmap view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Roadmap**, **Stats**, **Settings**) switches the active view.

**Roadmap** — the main list of roadmap items.
- An input labeled **Item title** and a dropdown labeled **Quarter** (options: `Q1`, `Q2`, `Q3`, `Q4`) and a dropdown labeled **Status** (options: `planned`, `in-progress`, `shipped`) plus an **Add item** button adds a new roadmap item (ignore a blank title).
- Each item displays its title, quarter, and status as a single line like `Feature X — Q2 — in-progress`.
- Each item has a **Ship** button that changes its status to `shipped`. The **Ship** button is disabled when the item is already `shipped`.
- A dropdown labeled **Filter by quarter** (options: `All`, `Q1`, `Q2`, `Q3`, `Q4`) filters the visible list. When a filter is active, only items matching that quarter are shown. The filter defaults to `All`.
- A live count is shown as `Showing: N items` reflecting however many items are currently visible after filtering.
- Seeded data: start with three items already in the list — `Dark mode` in `Q1` with status `shipped`, `API v2` in `Q2` with status `in-progress`, and `Mobile app` in `Q3` with status `planned`.

**Stats** — a read-only summary derived from ALL items (ignoring the Roadmap filter):
- `Total items: N`
- `Shipped: N`
- `In progress: N`
- `Planned: N`
- `Shipped %: P%` where P is shipped ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button that switches between `light` and `dark`. The current theme is applied as a `data-theme` attribute on a root element and persists across views.
- A **Reset items** button that clears all items back to the three seeded defaults.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
