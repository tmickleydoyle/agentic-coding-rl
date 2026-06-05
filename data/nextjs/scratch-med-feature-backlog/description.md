# Build a Feature Backlog app

Build a complete single-page React application — a lightweight feature backlog tool for a small product team — with **three views** the user navigates between using a top navigation bar: **Backlog**, **Stats**, and **Settings**. The app starts on the Backlog view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Backlog**, **Stats**, **Settings**) switches the active view.

**Backlog** — the main list of features.
- An input labeled **Feature title** plus an **Add feature** button adds a new feature (ignore a blank title). New features default to priority **P1** and status **idea**.
- Each feature row shows its title, a **Priority** select with options **P0**, **P1**, **P2**, and a **Status** select with options **idea**, **building**, **shipped**.
- A filter bar at the top contains a **Filter by priority** select with options **All**, **P0**, **P1**, **P2** — only features matching the selected priority are shown (All shows everything).
- A filter bar also contains a **Filter by status** select with options **All**, **idea**, **building**, **shipped** — only features matching the selected status are shown (combined with the priority filter).
- A **Delete** button on each row removes that feature.
- A heading shows the count of currently visible features, e.g. `Features (3)` — this count reflects the active filters.

**Stats** — a read-only summary derived from ALL features (ignoring filters):
- `Total: N` — total number of features.
- `P0: N`, `P1: N`, `P2: N` — count per priority.
- `Idea: N`, `Building: N`, `Shipped: N` — count per status.
- `Shipped: P%` — percentage of features with status **shipped**, as a whole-number percent (0% when there are no features), shown as the line `Shipped: P%`.

Wait — to avoid ambiguity, show the shipped percentage on its own line as `Shipped rate: P%` (e.g. `Shipped rate: 50%`), and keep the shipped count as `Shipped: N`.

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Seed the app with these three features on first load:
1. Title: **User authentication**, Priority: **P0**, Status: **building**
2. Title: **Dark mode**, Priority: **P1**, Status: **idea**
3. Title: **CSV export**, Priority: **P2**, Status: **shipped**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
