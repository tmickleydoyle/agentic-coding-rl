# Build an OKR Tracker app

Build a complete single-page React application — an OKR (Objectives and Key Results) tracker for a small team — with **three views** the user navigates between using a top navigation bar: **Objectives**, **Stats**, and **Settings**. The app starts on the Objectives view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Objectives**, **Stats**, **Settings**) switches the active view.

**Objectives** — a list of objectives, each with a progress percentage.
- An input labeled **Objective title** and a **Add objective** button adds a new objective with 0% progress (ignore a blank title).
- Each objective row shows its title and its current progress in the format `Progress: N%`.
- Each objective row has a **Progress** number input (labeled `Set progress for <title>`) that accepts 0–100, and an **Update** button that saves the value.
- Each objective row has a **Delete** button (labeled `Delete <title>`) that removes it.
- Objectives with progress >= 70 are considered **on-track**.

**Stats** — a read-only summary derived from the Objectives list:
- `Total objectives: N`
- `Average progress: N%` where N is the mean of all progress values rounded to the nearest whole number (0% when there are no objectives).
- `On-track (>=70%): N` showing how many objectives have progress >= 70.

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.
- A **Reset all objectives** button removes every objective from the list.

Seed the app with NO objectives on load. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).