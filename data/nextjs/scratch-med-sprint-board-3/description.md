# Build a Sprint Task Board

Build a complete single-page React application — a lightweight sprint task tracker — with **three views** the user navigates between using a top navigation bar: **Board**, **Stats**, and **Settings**. The app starts on the Board. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Board**, **Stats**, **Settings**) switches the active view.

**Board** — a list of sprint tasks.
- An input labeled **Task name** and an input labeled **Points** (a number, default empty) plus an **Add task** button adds a task. Ignore blank task names; default points to `0` if the field is empty or non-numeric.
- Each task shows its title and its point value.
- Each task has a **Status** select with options **todo**, **doing**, and **done** (in that order). New tasks start as **todo**.
- Each task has a **Delete** button that removes it.
- Above the list, show a status filter: a **Filter** select with options **all**, **todo**, **doing**, **done**. When a filter other than **all** is selected, only tasks matching that status are shown in the list (but all tasks still count in Stats).
- Show three live counts below the **Add task** button (always counts of ALL tasks, regardless of filter): `To Do: N`, `Doing: N`, `Done: N`.

**Stats** — a read-only summary computed from all tasks (ignoring the filter):
- `Total tasks: N`
- `Total points: N`
- `Done points: N`
- `Completion: P%` where P is done-task points ÷ total points as a whole-number percent (show `0%` when total points is 0).

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Clear all tasks** button removes every task from the board.

Seed the app with NO tasks on load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).