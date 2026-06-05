# Build a Founder Task Tracker app

Build a complete single-page React application — a lightweight task tracker for a solo founder — with **three views** the user navigates between using a top navigation bar: **Tasks**, **Stats**, and **Settings**. The app starts on the Tasks view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Tasks**, **Stats**, **Settings**) switches the active view.

**Tasks** — the main task list.
- An input labeled **Task title** and a dropdown labeled **Priority** (options: **High**, **Medium**, **Low**) plus an **Add task** button adds a new task (ignore a blank title). New tasks start as not done.
- A filter row has three buttons: **All**, **High**, **Medium**, **Low**. Clicking one shows only tasks matching that priority (or all tasks for **All**). The active filter button has `aria-pressed="true"`.
- Each task row shows its title, its priority label (**High**, **Medium**, or **Low**), and a checkbox labeled **Done** that toggles the task's done state.
- Below the list, show a summary line: `Showing: N of M` where N is the number of tasks currently visible (after filter) and M is the total number of tasks.

**Stats** — a read-only derived summary:
- `Total tasks: N`
- `Done: N`
- `Not done: N`
- `Done: P%` where P is done ÷ total as a whole-number percent (0% when there are no tasks)
- `High: N`, `Medium: N`, `Low: N` — counts of tasks by priority regardless of done state

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.
- A **Clear all tasks** button that removes every task from the list (the Stats view should then show all zeros).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
