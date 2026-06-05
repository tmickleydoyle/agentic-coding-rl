# Build an OKR Tracker app

Build a complete single-page React application — a lightweight OKR (Objectives and Key Results) tracker — with **three views** the user navigates between using a top navigation bar: **Objectives**, **Dashboard**, and **Settings**. The app starts on the Objectives view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Objectives**, **Dashboard**, **Settings**) switches the active view.

**Objectives** — a list of objectives with their progress.
- An input labeled **Objective title** plus an **Add objective** button adds a new objective with 0% progress (ignore a blank title).
- Each objective row shows its title and its current progress as `Progress: N%` (where N is 0–100).
- Each row has a **number input** labeled `Progress for <title>` (range 0–100) and an **Update** button. Clicking **Update** saves the new progress value for that objective.
- Each row also has a **Delete** button that removes that objective entirely.

**Dashboard** — a read-only summary computed from the objectives list:
- `Total objectives: N`
- `Average progress: P%` — the mean of all progress values as a whole-number percent (0% when there are no objectives).
- `On track: N` — count of objectives whose progress is **70% or above**.
- `Needs attention: N` — count of objectives whose progress is **below 70%**.

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.

Seed the app with these three objectives on first load:
- **Grow revenue** at 80%
- **Improve NPS** at 60%
- **Launch mobile app** at 40%

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).