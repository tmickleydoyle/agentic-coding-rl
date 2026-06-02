# Build a Founder Task Tracker

Build a complete single-page React application — a lightweight task management tool for solo founders — with **three views** the user navigates between using a top navigation bar: **Tasks**, **Stats**, and **Settings**. The app starts on the Tasks view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Tasks**, **Stats**, **Settings**) switches the active view.

**Tasks** — the main list of work items.
- An input labeled **Task title** and a priority selector labeled **Priority** (options: `High`, `Medium`, `Low`) plus an **Add task** button adds a new task (ignore a blank title). New tasks start as not done.
- A filter control labeled **Filter by priority** with options `All`, `High`, `Medium`, `Low` narrows the displayed list.
- Each task row shows its title, its priority label (`High`, `Medium`, or `Low`), and a checkbox labeled **Done** that toggles the task's done state.
- A **Delete** button on each row removes it permanently.
- Below the list show the count of displayed (filtered) tasks as `Showing: N tasks`.

**Stats** — a read-only summary derived from ALL tasks (ignoring the active filter):
- `Total: N` — total number of tasks
- `Done: N` — number of completed tasks
- `Remaining: N` — number of incomplete tasks
- `Completion: P%` — done ÷ total as a whole-number percent (0% when there are no tasks)
- `High: N` — count of High-priority tasks
- `Medium: N` — count of Medium-priority tasks
- `Low: N` — count of Low-priority tasks

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Clear all tasks** button removes every task from the list permanently.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
