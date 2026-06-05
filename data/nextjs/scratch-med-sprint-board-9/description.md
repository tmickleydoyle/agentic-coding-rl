# Build a Sprint Task Board app

Build a complete single-page React application — a lightweight sprint task tracker — with **three views** the user navigates between using a top navigation bar: **Board**, **Stats**, and **Settings**. The app starts on the Board. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Board**, **Stats**, **Settings**) switches the active view.

**Board** — a list of sprint tasks, each with a title, a status, and story points.
- An input labeled **Task title** and an input labeled **Points** (a number, default 1) plus an **Add task** button adds a task with status **Todo** (ignore a blank title or non-positive points).
- Each task row shows its title, current status, and points.
- Each task has a **Status** button that cycles through statuses in order: **Todo → Doing → Done → Todo**. The button label is the NEXT status it will move to: **Start** (moves Todo→Doing), **Finish** (moves Doing→Done), **Reset** (moves Done→Todo).
- Each task has a **Delete** button that removes it permanently.
- Above the list show three status group headings with live counts and total points: `Todo (N) — X pts`, `Doing (N) — X pts`, `Done (N) — X pts` (in that order). Tasks are grouped under their respective heading.

**Stats** — a read-only summary derived from the board:
- `Total tasks: N`
- `Total points: N`
- `Todo: N tasks, N pts`
- `Doing: N tasks, N pts`
- `Done: N tasks, N pts`
- `Completed: P%` where P is done-points ÷ total-points as a whole-number percent (0% when there are no points).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.
- A **Clear all tasks** button that removes every task from the board.

Seed NO tasks on startup — the board starts empty.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
