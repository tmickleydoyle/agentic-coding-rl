# Build a Portfolio Project Tracker

Build a complete single-page React application — a portfolio project tracker for a freelance designer or developer — with **three views** the user navigates between using a top navigation bar: **Projects**, **Stats**, and **Settings**. The app starts on the Projects view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Projects**, **Stats**, **Settings**) switches the active view.

**Projects** — the main list of portfolio projects.
- An input labeled **Project title** and a select labeled **Category** (options: **Web**, **Mobile**, **Design**, **Other**) and a select labeled **Status** (options: **Live**, **Draft**) plus an **Add project** button adds a project (ignore a blank title).
- Each project row shows its title, category, and status.
- A filter select labeled **Filter by status** with options **All**, **Live**, **Draft** filters the displayed list without removing items.
- A count line always visible that shows the total live projects: `Live projects: N` (counts ALL live projects regardless of filter).
- Each project row has a **Delete** button that removes it permanently.
- Each project row has a **Toggle status** button that flips its status between Live and Draft.

**Stats** — a read-only summary computed from all projects:
- `Total projects: N`
- `Live: N`
- `Draft: N`
- `Web: N`, `Mobile: N`, `Design: N`, `Other: N` (counts per category)
- `Live rate: P%` where P is live ÷ total as a whole-number percent (0% when there are no projects).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Reset projects** button that removes all projects from the list.

Seed the app with these three initial projects so tests have data immediately:
1. title: `Portfolio site`, category: `Web`, status: `Live`
2. title: `iOS app`, category: `Mobile`, status: `Draft`
3. title: `Brand identity`, category: `Design`, status: `Live`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
