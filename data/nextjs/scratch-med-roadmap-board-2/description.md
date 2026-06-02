# Build a Product Roadmap app

Build a complete single-page React application — a lightweight product roadmap tool — with **three views** the user navigates between using a top navigation bar: **Roadmap**, **Stats**, and **Settings**. The app starts on the Roadmap view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Roadmap**, **Stats**, **Settings**) switches the active view.

**Roadmap** — the main list of roadmap items.
- An input labeled **Item title** and a dropdown (select) labeled **Quarter** (with options `Q1`, `Q2`, `Q3`, `Q4`) and a second dropdown labeled **Status** (with options `Planned`, `In Progress`, `Shipped`) plus an **Add item** button. Clicking **Add item** appends the item to the list (ignore a blank title).
- Each item in the list shows its title, quarter, and status.
- A filter dropdown labeled **Filter by quarter** (with options `All`, `Q1`, `Q2`, `Q3`, `Q4`) filters the displayed list to only items matching the selected quarter (or shows all when `All` is selected). The filter does not affect the Stats data.
- Each item has a **Ship** button that sets its status to `Shipped`. The **Ship** button is disabled when the item is already `Shipped`.
- The heading above the list shows the count of currently-displayed items, like `Items (3)`.

**Stats** — a read-only summary derived from ALL items (unaffected by the quarter filter):
- `Total items: N`
- `Planned: N`
- `In Progress: N`
- `Shipped: N`
- `Shipped: P%` where P is shipped ÷ total as a whole-number percent (`0%` when there are no items).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Reset all items** button clears all roadmap items.

Seed the app with **no items** on first load. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.