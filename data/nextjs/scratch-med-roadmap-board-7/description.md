# Build a product roadmap board

Build a complete single-page React application — a lightweight product roadmap tool — with **three views** the user navigates between using a top navigation bar: **Roadmap**, **Stats**, and **Settings**. The app starts on the Roadmap view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Roadmap**, **Stats**, **Settings**) switches the active view.

**Roadmap** — the main list of roadmap items.
- An input labeled **Item title** and a dropdown labeled **Quarter** (options: `Q1`, `Q2`, `Q3`, `Q4`) plus an **Add item** button adds a new item with status `planned` (ignore a blank title).
- Each item row shows its title, quarter, and status.
- Each item has a **Mark in-progress** button (disabled if status is already `in-progress` or `shipped`), a **Mark shipped** button (disabled if status is already `shipped`), and a **Delete** button that removes it.
- A dropdown labeled **Filter by quarter** (options: `All`, `Q1`, `Q2`, `Q3`, `Q4`) filters the visible list; selecting `All` shows every item. Items not matching the filter are hidden but still counted in Stats.
- The heading below the nav shows **Roadmap Items (N)** where N is the count of currently visible items after filtering.

**Stats** — a read-only summary derived from all items (not filtered):
- `Total items: N`
- `Planned: N`
- `In Progress: N`
- `Shipped: N`
- `Shipped this quarter: N` where the quarter is fixed as **Q2** (i.e. count items whose quarter is Q2 and status is shipped).

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is reflected as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Reset all items** button clears every roadmap item (sets the list back to empty).

Seed the app with the following three items already present on first render:
1. Title: `Launch billing`, Quarter: `Q1`, Status: `shipped`
2. Title: `API v2`, Quarter: `Q2`, Status: `in-progress`
3. Title: `Mobile app`, Quarter: `Q3`, Status: `planned`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
