# Build an OKR Tracker app

Build a complete single-page React application — a lightweight OKR (Objectives and Key Results) tracker — with **three views** the user navigates between using a top navigation bar: **Objectives**, **Dashboard**, and **Settings**. The app starts on the Objectives view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Objectives**, **Dashboard**, **Settings**) switches the active view.

**Objectives** — a list of objectives with progress tracking.
- An input labeled **Objective title** plus an **Add objective** button adds a new objective with a starting progress of `0` (ignore a blank title).
- Each objective shows its title and its current progress as `Progress: N%` (where N is a whole number 0–100).
- Each objective has an input labeled `Set progress for <title>` (a number input) and an **Update** button that sets that objective's progress to the entered value (clamped to 0–100, whole number).
- Each objective has a **Delete** button that removes it from the list.
- Objectives with progress >= 70 are shown with the label **On Track** next to their title; objectives below 70 show **Off Track**.

**Dashboard** — a read-only summary computed from the objectives list:
- `Total objectives: N`
- `Average progress: P%` where P is the mean of all objectives' progress values as a whole-number percent (show `0%` when there are no objectives).
- `On track: N` — count of objectives with progress >= 70.
- `Off track: N` — count of objectives with progress < 70.

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.
- A **Filter: on track only** checkbox; when checked, the Objectives view shows only objectives whose progress is >= 70 (all objectives still count in Dashboard stats).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

## Seed data
The app starts with no objectives — the lists are empty on first load.