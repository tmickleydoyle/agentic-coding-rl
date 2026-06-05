# Build a Portfolio Projects Tracker

Build a complete single-page React application — a portfolio project tracker — with **three views** the user navigates between using a top navigation bar: **Projects**, **Stats**, and **Settings**. The app starts on the Projects view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Projects**, **Stats**, **Settings**) switches the active view.

## Seed data

The app starts with these three projects already loaded:
- Title: `Personal Website`, Category: `Web`, Status: `live`
- Title: `Budget App`, Category: `Mobile`, Status: `draft`
- Title: `API Boilerplate`, Category: `Backend`, Status: `live`

**Projects** — the main list view.
- An input labeled **Title** and an input labeled **Category** plus a **Add Project** button adds a new project with status `draft` (ignore a blank title or blank category).
- A dropdown labeled **Filter by status** with options `all`, `live`, and `draft` filters the displayed list. Default is `all`.
- Each project row shows its title, category, and status.
- A status toggle button labeled **Mark live** (when status is `draft`) or **Mark draft** (when status is `live`) toggles the project's status.
- A **Delete** button removes a project entirely.
- Above the list show a live count: `Showing: N projects` reflecting the current filter.

**Stats** — a read-only derived summary:
- `Total projects: N`
- `Live: N`
- `Draft: N`
- `Live rate: P%` where P is live ÷ total as a whole-number percent (0% when there are no projects).
- A breakdown list showing each unique category and how many projects belong to it, formatted as `Category: N` (e.g. `Web: 2`).

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).