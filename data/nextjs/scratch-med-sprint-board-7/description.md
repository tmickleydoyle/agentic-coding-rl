# Build a Sprint Task Board app

Build a complete single-page React application — a lightweight sprint task board for small teams — with **three views** the user navigates between using a top navigation bar: **Board**, **Stats**, and **Settings**. The app starts on the Board. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Board**, **Stats**, **Settings**) switches the active view.

**Board** — the main task list.
- An input labeled **Task name** and an input labeled **Points** (numeric) plus an **Add task** button adds a task. Ignore blank task names or non-positive point values.
- New tasks start with status **todo**.
- Each task row shows its name, its point value, and its current status.
- Each task has a **Status** selector (a `<select>` with accessible label `Status for <task name>`) with options **todo**, **doing**, and **done** — changing it updates the task status immediately.
- Each task has a **Delete** button (labeled `Delete <task name>`) that removes it.
- Above the list show three live counts: `To Do: N`, `Doing: N`, `Done: N` — each as its own line of visible text.

**Stats** — a read-only summary computed from the board (derived view):
- `Total tasks: N`
- `Total points: N`
- `Points done: N`
- `Points remaining: N` (total minus done)
- `Progress: P%` where P is points-done ÷ total-points as a whole-number percent (0% when there are no tasks or no points).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view navigation.
- A **Filter** section with a checkbox labeled **Hide done tasks** — when checked, tasks with status done are hidden on the Board (they still count in Stats).

Seed no initial data. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
