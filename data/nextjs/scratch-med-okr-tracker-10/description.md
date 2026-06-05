# Build an OKR Tracker app

Build a complete single-page React application — an OKR (Objectives and Key Results) tracker — with **three views** the user navigates between using a top navigation bar: **Objectives**, **Dashboard**, and **Settings**. The app starts on the Objectives view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Objectives**, **Dashboard**, **Settings**) switches the active view.

**Objectives** — a list of objectives with their progress.
- An input labeled **Objective title** plus an **Add objective** button adds a new objective with 0% progress (ignore a blank title).
- Each objective shows its title and its current progress as `Progress: N%` where N is 0–100.
- Each objective has a **Progress** number input (labeled `Progress for <title>`) allowing the user to type a value 0–100, and an **Update** button (labeled `Update <title>`) that saves that value. Values below 0 are clamped to 0 and above 100 are clamped to 100.
- Each objective has a **Delete** button (labeled `Delete <title>`) that removes it from the list.
- Objectives with progress >= 70 are considered **on track**.

**Dashboard** — a read-only summary derived from the objectives list:
- `Total objectives: N`
- `Average progress: P%` where P is the mean of all progress values as a whole-number percent (0% when there are no objectives)
- `On track: N` (count of objectives with progress >= 70)
- `Needs attention: N` (count of objectives with progress < 70)

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.
- A **Clear all objectives** button removes every objective from the list.

Seed the app with these three objectives already present when it first loads:
- Title: `Grow revenue`, progress: 80
- Title: `Reduce churn`, progress: 60
- Title: `Launch mobile app`, progress: 40

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
