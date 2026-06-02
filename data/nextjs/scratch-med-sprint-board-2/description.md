# Build a Sprint Task Board app

Build a complete single-page React application — a lightweight sprint task tracker — with **three views** the user navigates between using a top navigation bar: **Board**, **Stats**, and **Settings**. The app starts on the Board. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Board**, **Stats**, **Settings**) switches the active view.

**Board** — the main task management view.
- An input labeled **Task name** and an input labeled **Points** (a number, default 1) plus an **Add task** button adds a new task. Ignore a blank task name or non-positive points. New tasks start with status **todo**.
- Tasks are shown in a list. Each task row shows its name, its points, and its current status.
- Each task has a **Start** button (moves status from `todo` → `doing`; hidden when not in `todo`), a **Complete** button (moves status from `doing` → `done`; hidden when not in `doing`), and a **Delete** button that removes the task entirely.
- Below the task list, show three status counts on one line each: `To Do: N`, `Doing: N`, `Done: N` — where N is the count of tasks in each status.
- Also show the total points of all tasks as `Total points: N`.
- A **Filter** control: a set of three buttons labeled **All**, **To Do**, **Doing**, and **Done** that filter which tasks are visible in the list (default: All). The counts and total points always reflect ALL tasks regardless of the filter.

**Stats** — a read-only summary panel.
- Shows `Total tasks: N`, `To Do: N`, `Doing: N`, `Done: N`.
- Shows points broken down: `To Do points: N`, `Doing points: N`, `Done points: N`.
- Shows `Done: P%` where P is done-task count ÷ total tasks as a whole-number percent (0% when no tasks).

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute on a root element and persists across views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with no tasks initially (empty state).
