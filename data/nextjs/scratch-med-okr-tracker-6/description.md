# Build an OKR Tracker app

Build a complete single-page React application — an OKR (Objectives and Key Results) tracker for a small team — with **three views** the user navigates between using a top navigation bar: **Objectives**, **Dashboard**, and **Settings**. The app starts on the Objectives view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Objectives**, **Dashboard**, **Settings**) switches the active view.

**Objectives** — the main list of objectives.
- An input labeled **Objective title** plus an **Add objective** button adds a new objective with an initial progress of 0% (ignore a blank title).
- Each objective displays its title and its current progress formatted as `Progress: N%`.
- Each objective has a labeled input **Set progress for <title>** (a number input, min 0, max 100) and an **Update** button that sets that objective's progress to the entered value (clamp to 0–100).
- Each objective has a **Remove** button that deletes it from the list.
- The overall average progress is displayed at the bottom of the view as `Average: N%` (whole-number, 0% when there are no objectives).
- The count of on-track objectives (progress >= 70) is shown as `On track: N`.

**Dashboard** — a read-only summary panel, shown as text lines:
`Total objectives: N`, `On track: N`, `Needs attention: N` (progress < 70), and `Average progress: N%` (whole-number, 0% when empty). This view reacts to changes made in the Objectives view.

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Seed the app with these three objectives so the tests have data to work with:
- Title: `Grow revenue`, progress: `80`
- Title: `Reduce churn`, progress: `60`
- Title: `Launch feature`, progress: `70`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
