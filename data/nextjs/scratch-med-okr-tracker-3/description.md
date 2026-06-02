# Build an OKR Tracker app

Build a complete single-page React application — an OKR (Objectives and Key Results) tracker — with **three views** the user navigates between using a top navigation bar: **Objectives**, **Dashboard**, and **Settings**. The app starts on the Objectives view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Objectives**, **Dashboard**, **Settings**) switches the active view.

**Objectives** — a list of objectives with progress tracking.
- An input labeled **Objective title** plus an **Add objective** button adds a new objective with 0% progress (ignore a blank title).
- Each objective displays its title and its current progress as `Progress: N%` where N is a whole number between 0 and 100.
- Each objective has a numeric input labeled `Progress for <title>` (a number input, min 0, max 100) pre-filled with the current progress value, and an **Update** button next to it that saves the entered value.
- Each objective has a **Delete** button that removes it from the list.
- Objectives with progress >= 70 are considered **on track**.

**Dashboard** — a read-only summary panel:
- Shows `Total objectives: N`
- Shows `Average progress: P%` where P is the mean of all objectives' progress values as a whole-number percent (0% when there are no objectives).
- Shows `On track: N` — the count of objectives with progress >= 70.
- Shows `Off track: N` — the count of objectives with progress < 70.

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element, and it persists as the user navigates between views.

Seed the app with these three objectives already present when it loads:
- Title: `Grow revenue`, progress: `80`
- Title: `Improve retention`, progress: `60`
- Title: `Launch new feature`, progress: `40`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).