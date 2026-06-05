# Build an OKR Tracker app

Build a complete single-page React application — a simple OKR (Objectives and Key Results) tracker — with **three views** the user navigates between using a top navigation bar: **Objectives**, **Dashboard**, and **Settings**. The app starts on the Objectives view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Objectives**, **Dashboard**, **Settings**) switches the active view.

**Objectives** — a list of objectives with progress tracking.
- An input labeled **Objective title** plus an **Add objective** button adds a new objective with 0% progress (ignore a blank title).
- Each objective shows its title and its current progress as `Progress: N%` where N is the stored integer.
- Each objective has an input labeled `Progress for <title>` (a number input, 0–100) and an **Update** button that sets the progress to that value (clamp to 0–100).
- Each objective has a **Remove** button that deletes it from the list.
- The list heading shows the total count: `Objectives (N)`.

**Dashboard** — a read-only summary computed from the objectives list:
- `Total objectives: N`
- `Average progress: P%` where P is the mean of all progress values rounded to a whole number (show `0%` when there are no objectives).
- `On track: N` where N is the count of objectives whose progress is 70% or above.
- `Completed: N` where N is the count of objectives at exactly 100%.

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists as the user navigates.

Seed the app with NO objectives at startup. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).