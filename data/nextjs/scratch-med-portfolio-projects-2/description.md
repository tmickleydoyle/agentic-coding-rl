# Build a Portfolio Projects app

Build a complete single-page React application — a portfolio project tracker — with **three views** the user navigates between using a top navigation bar: **Projects**, **Stats**, and **Settings**. The app starts on the Projects view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Projects**, **Stats**, **Settings**) switches the active view.

**Projects** — the main list of portfolio projects.
- An input labeled **Project title** and a select labeled **Category** (options: **Web**, **Mobile**, **Design**, **Other**) and a select labeled **Status** (options: **Live**, **Draft**) plus an **Add project** button adds a new project (ignore a blank title).
- Below the add form, show a filter control: a select labeled **Filter by status** with options **All**, **Live**, **Draft**. The list respects the current filter.
- Each project row shows its title, category, and status. Each row has a **Toggle status** button that switches that project between Live and Draft.
- Each project row also has a **Delete** button that removes it.
- When no projects match the filter, show the text `No projects to show`.
- Above the list, show a live count in the format `Live projects: N` where N is always the total number of Live projects regardless of the current filter.

**Stats** — a read-only summary derived from all projects (ignoring the filter):
- `Total projects: N`
- `Live: N`
- `Draft: N`
- `Web: N`, `Mobile: N`, `Design: N`, `Other: N` (counts per category)
- `Live rate: P%` where P is Live ÷ Total as a whole-number percent (0% when there are no projects).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.

Seed the app with NO initial projects. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).