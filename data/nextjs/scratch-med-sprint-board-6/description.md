# Build a Sprint Task Board app

Build a complete single-page React application — a lightweight sprint task board — with **three views** the user navigates between using a top navigation bar: **Board**, **Stats**, and **Settings**. The app starts on the Board. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Board**, **Stats**, **Settings**) switches the active view.

**Board** — the main task list.
- An input labeled **Task name** and a number input labeled **Points** (default `1`) plus an **Add task** button adds a task. Ignore a blank task name. Points must be a positive integer (default to `1` if the value entered is less than 1).
- Each task has a **Status** that cycles through: `todo` → `doing` → `done`. Display the current status on each task row.
- Each task row shows its title, its points, its current status, and two buttons: **Start** (moves `todo` → `doing`, disabled unless status is `todo`) and **Finish** (moves `doing` → `done`, disabled unless status is `doing`).
- Below the task list, show three live summary lines in this exact format:
  - `To Do: N tasks, P pts` — count and total points of todo tasks
  - `Doing: N tasks, P pts` — count and total points of doing tasks
  - `Done: N tasks, P pts` — count and total points of done tasks
- A **Clear done** button removes all tasks with status `done` from the board.

**Stats** — a read-only derived summary:
- `Total tasks: N`
- `Total points: P`
- `Done: N tasks`
- `Done points: P`
- `Progress: P%` where P is done-points ÷ total-points as a whole-number percent (show `0%` when total points is 0).

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Hide done tasks** checkbox; when checked, tasks with status `done` are hidden on the Board (they are still counted in Stats and in the Board summary lines).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with **no tasks** on load.