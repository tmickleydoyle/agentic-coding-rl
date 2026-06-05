# Build a Sprint Task Board

Build a complete single-page React application — a lightweight sprint task tracker — with **three views** the user navigates between using a top navigation bar: **Board**, **Stats**, and **Settings**. The app starts on the Board. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Board**, **Stats**, **Settings**) switches the active view.

**Board** — a task list with status columns.
- An input labeled **Task name** plus a **Points** number input (labeled **Points**) and an **Add task** button adds a task. Ignore a blank task name. Default points value is `1` if left empty or zero.
- Each task shows its title and its points value.
- Tasks are grouped into three columns: **To Do**, **In Progress**, and **Done** (in that order). Each column heading shows its name and a live count, like `To Do (2)`.
- Each task has a **Move right** button and a **Move left** button. **Move left** is disabled when the task is in **To Do**; **Move right** is disabled when the task is in **Done**.
- Below each column heading also show the total points for that column like `Points: 5`.

**Stats** — a read-only summary computed from the board:
- `Total tasks: N`
- `Total points: N`
- `To Do: N tasks, N pts`
- `In Progress: N tasks, N pts`
- `Done: N tasks, N pts`
- `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no tasks).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Hide done tasks** checkbox; when checked, tasks in the Done column are hidden on the Board (they still count in Stats).

Seed the app with NO tasks initially.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).