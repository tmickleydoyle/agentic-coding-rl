# Build a Sprint Task Board app

Build a complete single-page React application — a lightweight sprint task tracker — with **three views** the user navigates between using a top navigation bar: **Board**, **Stats**, and **Settings**. The app starts on the Board. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Board**, **Stats**, **Settings**) switches the active view.

**Board** — the main task management view.
- An input labeled **Task name** and an input labeled **Points** (a positive integer) plus an **Add task** button adds a task. Ignore a blank task name or non-positive points value.
- New tasks start with status **todo**.
- Each task shows its name, its points, and its current status.
- Each task has a **Status** dropdown (a `<select>`) with options **todo**, **doing**, and **done** that changes the task's status.
- Each task has a **Delete** button that removes it.
- Three sections below the form show live counts and totals: **To Do (N tasks, P pts)**, **Doing (N tasks, P pts)**, and **Done (N tasks, P pts)** — where N is the count of tasks in that status and P is the sum of their points. Example: `To Do (2 tasks, 8 pts)`.

**Stats** — a read-only summary computed from the board:
- `Total tasks: N`
- `Total points: P`
- `Done tasks: N`
- `Done points: P`
- `Completion: P%` where P is done-task count ÷ total-task count as a whole-number percent (0% when there are no tasks).

**Settings**
- A **Toggle theme** button that switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.
- A **Hide done tasks** checkbox; when checked, tasks with status **done** are hidden on the Board (they still count in Stats).

Seed the app with NO tasks on first load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.