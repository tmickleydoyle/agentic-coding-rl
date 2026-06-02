# Build a product roadmap tracker

Build a complete single-page React application — a lightweight product roadmap tool — with **three views** the user navigates between using a top navigation bar: **Roadmap**, **Stats**, and **Settings**. The app starts on the Roadmap view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Roadmap**, **Stats**, **Settings**) switches the active view.

**Roadmap** — a list of roadmap items.
- An input labeled **Item title** and a dropdown labeled **Quarter** (options: `Q1`, `Q2`, `Q3`, `Q4`) and a dropdown labeled **Status** (options: `planned`, `in-progress`, `shipped`) plus an **Add item** button adds a new item (ignore a blank title).
- Each item shows its title, its quarter, and its status.
- Each item has a **Ship** button that sets the item's status to `shipped` (the button is disabled if the item is already `shipped`).
- A dropdown labeled **Filter by quarter** (options: `All`, `Q1`, `Q2`, `Q3`, `Q4`) filters the list to show only items in the chosen quarter (or all items when `All` is selected). The filter persists when navigating away and back.
- A summary line beneath the filter shows `Showing: N items` where N is the number of currently visible items.
- A summary line shows `Shipped: N` where N is the total number of shipped items across ALL items (not filtered).

**Stats** — a read-only derived summary:
- `Total items: N`
- `Planned: N`
- `In Progress: N`
- `Shipped: N`
- `Ship rate: P%` where P is shipped ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the app with these three items already present:
- Title: `Mobile login`, Quarter: `Q1`, Status: `shipped`
- Title: `Dashboard v2`, Quarter: `Q2`, Status: `in-progress`
- Title: `API rate limiting`, Quarter: `Q3`, Status: `planned`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
