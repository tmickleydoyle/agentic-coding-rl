# Build an OKR Tracker app

Build a complete single-page React application — an OKR (Objectives and Key Results) tracker for a small team — with **three views** the user navigates between using a top navigation bar: **Objectives**, **Dashboard**, and **Settings**. The app starts on the Objectives view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Objectives**, **Dashboard**, **Settings**) switches the active view.

**Objectives** — the main list of objectives.
- An input labeled **Objective title** plus an **Add objective** button adds a new objective with an initial progress of 0% (ignore a blank title).
- Each objective shows its title and its current progress formatted as `Progress: N%`.
- Each objective has a **number input** labeled `Set progress for <title>` (values 0–100) and an **Update** button labeled `Update <title>` that saves the new progress value.
- The list heading shows the total count: `Objectives (N)`.

**Dashboard** — a read-only summary derived from the objectives list:
- `Total objectives: N`
- `Average progress: P%` where P is the mean of all objectives' progress rounded to the nearest whole number (show `0%` when there are no objectives).
- `On track: N` where N is the count of objectives with progress >= 70.
- `Completed: N` where N is the count of objectives with progress = 100.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the app with **no objectives** on first load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
