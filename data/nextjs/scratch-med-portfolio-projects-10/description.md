# Build a Portfolio Projects tracker

Build a complete single-page React application for tracking a small portfolio of projects. It has **three views** navigated by a top navigation bar: **Projects**, **Stats**, and **Settings**. The app starts on the **Projects** view. All state is kept in memory (no backend).

Navigation: a nav bar with buttons labeled **Projects**, **Stats**, and **Settings** switches the active view.

**Projects** — the main list of portfolio projects.
- An input labeled **Title** and a dropdown (select) labeled **Category** (options: **Web**, **Mobile**, **Design**, **Other**) and a dropdown labeled **Status** (options: **Live**, **Draft**), plus an **Add Project** button. Ignore blank titles.
- Each project shows its title, category, and status.
- A **Filter** section contains a dropdown labeled **Filter by status** with options **All**, **Live**, **Draft**. When a filter is active, only matching projects are shown in the list.
- A count line below the filter reads `Showing: N projects` (reflecting the current filter).
- Each project row has a **Delete** button (labeled `Delete <title>`) that removes it.
- Each project row has a **Toggle status** button (labeled `Toggle <title>`) that flips the project between Live and Draft.

**Stats** — a read-only summary derived from all projects (ignoring any active filter):
- `Total projects: N`
- `Live: N`
- `Draft: N`
- `Live rate: P%` where P is live ÷ total as a whole-number percent (0% when there are no projects).

**Settings**
- A **Toggle theme** button that switches between light and dark theme. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.

Seed the app with these three projects already present when it first loads:
1. Title: `Personal Site`, Category: `Web`, Status: `Live`
2. Title: `Recipe App`, Category: `Mobile`, Status: `Draft`
3. Title: `Logo Pack`, Category: `Design`, Status: `Live`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries. Routing is in-app state only.