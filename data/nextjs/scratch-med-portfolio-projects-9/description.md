# Build a Portfolio Projects Tracker

Build a complete single-page React application — a portfolio project tracker for a freelancer or small agency — with **three views** the user navigates between using a top navigation bar: **Projects**, **Stats**, and **Settings**. The app starts on the Projects view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Projects**, **Stats**, **Settings**) switches the active view.

**Projects** — the main list of portfolio projects.
- An input labeled **Project title** and a dropdown (select) labeled **Category** with options **Web**, **Mobile**, **Design**, and **Other**. A button labeled **Add project** adds a new project with status defaulting to **draft** (ignore a blank title).
- Each project row shows its title, category, and a **Status** toggle button. When status is `draft` the button reads **Publish**; when status is `live` the button reads **Unpublish**. Clicking it toggles the project between `draft` and `live`.
- A dropdown labeled **Filter by category** with options **All**, **Web**, **Mobile**, **Design**, and **Other** filters the displayed list (default **All**). Filtering affects only the displayed rows, not the totals in Stats.
- A summary line below the filter reads `Live projects: N` where N is the count of ALL live projects regardless of the current filter.

**Stats** — a read-only summary derived from all projects (ignores any active filter):
- `Total projects: N`
- `Live: N`
- `Draft: N`
- `Live rate: P%` where P is live ÷ total as a whole-number percent (0% when there are no projects).
- Four category counts, each on its own line: `Web: N`, `Mobile: N`, `Design: N`, `Other: N`.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Reset projects** button that clears all projects back to an empty list.

Seed the app with these three starter projects already in the list:
1. Title: `Agency Website`, Category: `Web`, Status: `live`
2. Title: `Food Delivery App`, Category: `Mobile`, Status: `draft`
3. Title: `Brand Identity`, Category: `Design`, Status: `live`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
