# Build a Founder Task Tracker app

Build a complete single-page React application — a lightweight task management tool for solo founders — with **three views** navigated via a top navigation bar: **Tasks**, **Stats**, and **Settings**. The app starts on the Tasks view. All state is kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Tasks**, **Stats**, **Settings**) switches the active view.

**Tasks** — the main task list.
- An input labeled **Task name** and a dropdown labeled **Priority** (options: **High**, **Medium**, **Low**) plus an **Add task** button adds a new task (ignore a blank title).
- Each task row shows its title, its priority label (**High**, **Medium**, or **Low**), a **Done** toggle button that marks the task complete/incomplete, and a **Delete** button that removes the task.
- A completed task row displays the text **✓** prefix before its title.
- A dropdown labeled **Filter by priority** lets the user filter the visible list to **All**, **High**, **Medium**, or **Low** priority tasks. The filter does not affect Stats.
- Below the list, show a live summary line in the format `Showing: N of M tasks` where N is the number of tasks matching the current filter and M is the total number of tasks.

**Stats** — a read-only summary computed from all tasks (ignoring the current filter):
- `Total: N` — total task count.
- `Done: N` — count of completed tasks.
- `Pending: N` — count of incomplete tasks.
- `High: N` — count of tasks with High priority.
- `Medium: N` — count of tasks with Medium priority.
- `Low: N` — count of tasks with Low priority.
- `Done: P%` — percentage of tasks that are done, as a whole-number percent (0% when there are no tasks), displayed as the text `Done: P%`.

**Settings**
- A **Toggle theme** button that switches between **light** and **dark** themes. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, persisted as the user navigates.
- Display the current theme name next to or inside the button so the user knows the active theme, e.g. `Toggle theme (current: light)`.

Seed the app with NO initial tasks. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.