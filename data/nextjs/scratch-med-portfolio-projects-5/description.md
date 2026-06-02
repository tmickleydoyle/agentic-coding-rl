# Build a Portfolio Projects Tracker

Build a complete single-page React application — a portfolio project tracker for a freelancer or small agency — with **three views** the user navigates between using a top navigation bar: **Projects**, **Stats**, and **Settings**. The app starts on the Projects view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Projects**, **Stats**, **Settings**) switches the active view.

**Projects** — the main list of portfolio projects.
- An input labeled **Project title** and a dropdown (select) labeled **Category** (options: **Web**, **Mobile**, **Design**, **Other**) and a dropdown (select) labeled **Status** (options: **Live**, **Draft**) and an **Add project** button add a new project (ignore a blank title).
- Each project row shows its title, category, and status badge.
- A filter dropdown labeled **Filter by status** with options **All**, **Live**, **Draft** filters the displayed list without removing items from storage. When a filter is active, only matching projects are shown.
- The heading shows the count of currently displayed projects: `Projects (N)`.
- Each project row has a **Toggle status** button that switches the project between Live and Draft.
- Each project row has a **Delete** button that permanently removes it.

**Stats** — a read-only derived summary:
- `Total projects: N`
- `Live: N`
- `Draft: N`
- `Live rate: P%` where P is live ÷ total as a whole-number percent (0% when there are no projects).
- A breakdown line for each category showing how many projects it contains, in the format `Web: N`, `Mobile: N`, `Design: N`, `Other: N`.

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Default status** select labeled **Default status** with options **Live** and **Draft** that controls what status is pre-selected when adding a new project on the Projects view.

Seed the app with these three projects already present on first render:
- Title: `Landing Page`, Category: `Web`, Status: `Live`
- Title: `iOS App`, Category: `Mobile`, Status: `Draft`
- Title: `Brand Kit`, Category: `Design`, Status: `Live`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
