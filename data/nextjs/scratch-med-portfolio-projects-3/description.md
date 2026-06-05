# Build a Portfolio Project Tracker

Build a complete single-page React application — a portfolio project tracker for a freelancer or small agency — with **three views** the user navigates between using a top navigation bar: **Projects**, **Stats**, and **Settings**. The app starts on the Projects view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Projects**, **Stats**, **Settings**) switches the active view.

**Projects** — the main list of portfolio projects.
- An input labeled **Project title** and a dropdown labeled **Category** (options: **Web**, **Mobile**, **Design**, **Other**) plus an **Add project** button adds a new project with status **Draft** (ignore a blank title).
- Each project shows its title, category, and a **Status** toggle button. When a project's status is **Draft**, the toggle button is labeled **Publish**; when the status is **Live**, the toggle button is labeled **Unpublish**.
- A dropdown labeled **Filter by category** (options: **All**, **Web**, **Mobile**, **Design**, **Other**) filters the visible list. When a filter is active, only projects matching that category are shown.
- A summary line below the heading reads `Showing: N of M` where N is the number of currently visible projects and M is the total number of projects.
- A **Delete** button on each project removes it permanently.
- Projects are seeded with three initial entries: title **Personal Website**, category **Web**, status **Live**; title **Fitness App**, category **Mobile**, status **Draft**; title **Logo Pack**, category **Design**, status **Live**.

**Stats** — a read-only summary computed from all projects (ignoring the current filter):
- `Total projects: N`
- `Live: N`
- `Draft: N`
- `Live rate: P%` where P is live ÷ total as a whole-number percent (0% when there are no projects).
- Under a **By category** heading, one line per category that has at least one project, formatted as `Web: N` / `Mobile: N` / `Design: N` / `Other: N`.

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
