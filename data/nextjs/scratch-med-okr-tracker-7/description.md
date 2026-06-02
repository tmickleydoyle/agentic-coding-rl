# Build an OKR Tracker app

Build a complete single-page React application — a lightweight OKR (Objectives & Key Results) tracker — with **three views** the user navigates between using a top navigation bar: **Objectives**, **Dashboard**, and **Settings**. The app starts on the Objectives view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Objectives**, **Dashboard**, **Settings**) switches the active view.

**Objectives** — a list of objectives with their progress.
- An input labeled **Objective title** plus an **Add objective** button adds a new objective (ignore a blank title). New objectives start with a progress of 0%.
- Each objective row shows its title, its current progress as `Progress: N%`, a labeled number input **Set progress for <title>** (accepts 0–100), and an **Update** button that saves the new progress value (clamped to 0–100).
- A button labeled **Remove** next to each objective removes it from the list.
- The list heading should read **Objectives (N)** where N is the total count of objectives.

**Dashboard** — a read-only summary computed from the current objectives:
- `Total objectives: N`
- `Average progress: P%` where P is the average of all progress values, rounded to a whole number (0% when there are no objectives).
- `On track: N` where N is the count of objectives with progress >= 70.
- `Completed: N` where N is the count of objectives with progress equal to 100.

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Seed the app with **no objectives** on first render (empty state).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
