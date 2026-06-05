# Build an OKR Tracker app

Build a complete single-page React application — a lightweight OKR (Objectives and Key Results) tracking tool — with **three views** the user navigates between using a top navigation bar: **Objectives**, **Dashboard**, and **Settings**. The app starts on the Objectives view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Objectives**, **Dashboard**, **Settings**) switches the active view.

**Objectives** — a list of objectives, each with a progress percentage.
- An input labeled **Objective title** and a **Add objective** button adds a new objective with progress starting at `0` (ignore a blank title).
- Each objective shows its title, its current progress as `Progress: N%`, and a number input labeled `Set progress for <title>` (where `<title>` is the objective's title) that lets the user type a value from 0–100, plus an **Update** button that applies it.
- Invalid values (empty, below 0, above 100) are ignored when the Update button is clicked.
- A **Remove** button on each objective deletes it from the list.

**Dashboard** — a read-only summary computed live from the objectives list:
- `Total objectives: N`
- `Average progress: P%` where P is the mean of all progress values as a whole-number percent (show `0%` when there are no objectives)
- `On track: N` where N is the count of objectives whose progress is **70 or above**
- `Completed: N` where N is the count of objectives whose progress is exactly **100**

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Seed the app with **no objectives** on load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
