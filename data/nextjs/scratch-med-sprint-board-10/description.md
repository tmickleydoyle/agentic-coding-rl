# Build a Sprint Task Board

Build a complete single-page React application — a lightweight sprint task tracker — with **three views** the user navigates between using a top navigation bar: **Board**, **Stats**, and **Settings**. The app starts on the Board. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Board**, **Stats**, **Settings**) switches the active view.

**Board** — the main task management view.
- An input labeled **Task name** plus a numeric input labeled **Points** (default value `1`) and an **Add task** button adds a task (ignore a blank task name; points must be a positive integer, default to `1` if left blank or invalid).
- Each task shows its title and its point value in the format `(Pts: N)`.
- Each task has a **Status** selector (a `<select>` or set of buttons) letting the user pick **Todo**, **Doing**, or **Done**.
- Tasks are grouped into three visible sections labeled **Todo**, **Doing**, and **Done**. Each section heading shows the section name and the count of tasks in it, like `Todo (2)`, `Doing (1)`, `Done (0)`.
- Each section also shows the total points for tasks within it in the format `Points: N`.
- Each task has a **Delete** button that removes it entirely.

**Stats** — a read-only summary derived from the board data:
- `Total tasks: N`
- `Total points: N`
- `Todo: N tasks, N pts`
- `Doing: N tasks, N pts`
- `Done: N tasks, N pts`
- `Completion: P%` where P is the count of Done tasks divided by total tasks as a whole-number percent (show `0%` when there are no tasks).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.
- A **Hide done tasks** checkbox; when checked, tasks with status **Done** are hidden on the Board (they still count in Stats). The checkbox label reads **Hide done tasks**.

Seed the app with NO tasks initially. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
