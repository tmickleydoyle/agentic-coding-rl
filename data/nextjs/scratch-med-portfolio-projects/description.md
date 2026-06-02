# Build a Portfolio Projects app

Build a complete single-page React application — a portfolio project tracker — with **three views** the user navigates between using a top navigation bar: **Projects**, **Stats**, and **Settings**. The app starts on the Projects view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Projects**, **Stats**, **Settings**) switches the active view.

**Projects** — the main list of portfolio projects.
- An input labeled **Project title** and a select labeled **Category** (options: **Web**, **Mobile**, **Design**) and a select labeled **Status** (options: **Live**, **Draft**) plus an **Add project** button adds a new project (ignore a blank title).
- Each project shows its title, category, and status as a badge (`Live` or `Draft`).
- Each project has a **Toggle status** button that flips its status between Live and Draft.
- Each project has a **Delete** button that removes it from the list.
- A select labeled **Filter by category** with options **All**, **Web**, **Mobile**, **Design** filters the visible list. The heading shows the count of currently visible projects: `Projects (N)`.
- The count of live projects is shown as `Live: N` just below the heading.

**Stats** — a read-only summary derived from all projects (ignoring any active filter):
- `Total projects: N`
- `Live: N`
- `Draft: N`
- `Web: N`, `Mobile: N`, `Design: N`
- `Live rate: P%` where P is live ÷ total as a whole-number percent (0% when there are no projects).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the app with **no projects** on first load.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
