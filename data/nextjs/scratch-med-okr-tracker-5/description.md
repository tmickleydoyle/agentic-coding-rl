# Build an OKR Tracker app

Build a complete single-page React application — an OKR (Objectives and Key Results) tracker — with **three views** the user navigates between using a top navigation bar: **Objectives**, **Dashboard**, and **Settings**. The app starts on the Objectives view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Objectives**, **Dashboard**, **Settings**) switches the active view.

**Objectives** — a list of objectives with progress tracking.
- An input labeled **Objective title** plus an **Add objective** button adds a new objective with 0% progress (ignore a blank title).
- Each objective shows its title and its current progress formatted as `Progress: N%`.
- Each objective has a **Progress** input (number, 0–100) and an **Update** button that sets its progress to the entered value (clamp to 0–100, ignore non-numeric input).
- Each objective has a **Delete** button that removes it.
- The list heading shows a live count: `Objectives (N)`.

**Dashboard** — a read-only summary computed from the objectives list:
- `Total objectives: N`
- `Average progress: P%` where P is the mean of all objectives' progress values rounded to the nearest whole number (0% when there are no objectives).
- `On track: N` where an objective is "on track" when its progress is 70 or above.
- `Completed: N` where an objective is "completed" when its progress is exactly 100.

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.
- A **Reset all objectives** button that clears the entire objectives list.

Seed the app with **no** initial objectives. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
