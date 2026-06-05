# Build a Sprint Task Board app

Build a complete single-page React application — a simple sprint task board for a small dev team — with **three views** the user navigates between using a top navigation bar: **Board**, **Stats**, and **Settings**. The app starts on the Board. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Board**, **Stats**, **Settings**) switches the active view.

**Board** — the main task management view.
- An input labeled **Task name** and a number input labeled **Points** (default `1`) plus an **Add task** button adds a task (ignore a blank task name; points must be a positive integer, default to `1` if invalid).
- Each task shows its title, its point value, and its current status. Status cycles through three values: **todo**, **doing**, **done**.
- Each task has a **Move right** button that advances its status one step (todo → doing → doing → done; disabled when already **done**) and a **Move left** button that moves it back one step (disabled when already **todo**).
- Three column sections are displayed, each with a heading showing the name and count and total points: `To Do (2) — 5 pts`, `Doing (1) — 3 pts`, `Done (0) — 0 pts`. Columns are labeled **To Do**, **Doing**, **Done** (in that order). Tasks appear under their matching column.
- A **Delete** button on each task removes it entirely.

**Stats** — a read-only summary computed from current board data:
- `Total tasks: N`
- `Total points: N`
- `To Do: N tasks, N pts`
- `Doing: N tasks, N pts`
- `Done: N tasks, N pts`
- `Completion: P%` where P is done-task count ÷ total-task count as a whole-number percent (0% when there are no tasks).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is stored as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Hide done tasks** checkbox; when checked, tasks in the Done column are hidden on the Board (they still count in Stats). The checkbox label text is **Hide done tasks**.

Seed the app with NO tasks at startup. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
