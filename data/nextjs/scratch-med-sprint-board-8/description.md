# Build a Sprint Task Board app

Build a complete single-page React application — a lightweight sprint task tracker — with **three views** the user navigates between using a top navigation bar: **Board**, **Stats**, and **Settings**. The app starts on the Board view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Board**, **Stats**, **Settings**) switches the active view.

**Board** — the main task management view.
- An input labeled **Task name** and a number input labeled **Points** (defaulting to 1) plus an **Add task** button adds a task to the board with status **todo** (ignore a blank task name; points must be a positive integer, clamp to 1 if invalid).
- Each task row shows its title, its point value, and a **Status** selector (a `<select>`) with options **todo**, **doing**, and **done** that updates the task's status immediately.
- Each task has a **Delete** button that removes it.
- Above the task list, three counters show the live count and total points for each status column as separate lines:
  - `To Do: N tasks, P pts`
  - `Doing: N tasks, P pts`
  - `Done: N tasks, P pts`
- A **Filter** dropdown (labeled **Filter by status**) with options **All**, **todo**, **doing**, **done** filters which tasks are visible in the list (counts/totals above always reflect ALL tasks regardless of filter).

**Stats** — a read-only summary computed from all tasks:
- `Total tasks: N`
- `Total points: P`
- `Done: N tasks`
- `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no tasks)
- `Points done: P` (sum of points for done tasks)

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.
- A **Clear all tasks** button removes every task from the board.

Seed the app with NO initial tasks. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
