# Build a Feature Backlog app

Build a complete single-page React application — a lightweight feature backlog tracker — with **three views** the user navigates between using a top navigation bar: **Backlog**, **Stats**, and **Settings**. The app starts on the **Backlog** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Backlog**, **Stats**, **Settings**) switches the active view.

**Backlog** — the main feature list.
- An input labeled **Feature title** and a dropdown labeled **Priority** (options: `P0`, `P1`, `P2`) and an **Add feature** button that adds a new feature with status `idea` (ignore a blank title).
- Each feature shows its title, priority badge, and current status.
- Each feature has a **Status** dropdown that cycles through statuses: `idea`, `building`, `shipped`.
- A filter row with a dropdown labeled **Filter by priority** with options `All`, `P0`, `P1`, `P2` — only features matching the selected priority are shown (All shows every feature).
- Column/section headings (or summary chips) above the list show live counts per priority for ALL features (not just filtered): `P0 (N)`, `P1 (N)`, `P2 (N)`.

**Stats** — a read-only summary panel:
- `Total features: N`
- `Idea: N`
- `Building: N`
- `Shipped: N`
- `Shipped %: P%` where P is shipped ÷ total as a whole-number percent (0% when total is 0).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is stored as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.

Seed the app with **no pre-existing features** (empty initial state). Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
