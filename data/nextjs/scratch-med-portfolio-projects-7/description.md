# Build a Portfolio Projects tracker

Build a complete single-page React application — a portfolio project tracker for a freelancer or small agency — with **three views** the user navigates between using a top navigation bar: **Projects**, **Stats**, and **Settings**. The app starts on the Projects view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Projects**, **Stats**, **Settings**) switches the active view.

**Projects** — the main list of portfolio projects.
- An input labeled **Project title** plus a **Category** input (labeled **Category**) and an **Add project** button adds a new project. Ignore a blank title. New projects start with status **draft**.
- Each project row shows its title, its category, and its status (**live** or **draft**).
- Each project row has a **Publish** button (only shown when status is draft) that changes the project's status to **live**, and a **Unpublish** button (only shown when status is live) that changes it back to **draft**.
- A filter control: a dropdown labeled **Filter by status** with options **All**, **Live**, **Draft**. When **Live** is selected, only live projects are shown; when **Draft**, only draft projects; when **All**, all projects are shown. The filter does NOT affect the Stats view counts.
- A summary line below the heading showing `Live: N` where N is the count of live projects (regardless of the filter).

**Stats** — a read-only summary computed from all projects:
- `Total projects: N`
- `Live: N`
- `Draft: N`
- `Live rate: P%` where P is live ÷ total as a whole-number percent (0% when there are no projects).
- A breakdown by category: for each category present, show a line like `web: 2 projects` (category name as entered, followed by the project count).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and persists across view navigation.

Seed the app with these three initial projects so tests can rely on them:
1. Title: `Agency Site`, Category: `web`, Status: `live`
2. Title: `Mobile App`, Category: `mobile`, Status: `draft`
3. Title: `Landing Page`, Category: `web`, Status: `draft`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
