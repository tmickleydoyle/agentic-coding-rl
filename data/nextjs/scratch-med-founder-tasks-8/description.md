# Build a Founder Task Tracker app

Build a complete single-page React application — a lightweight task manager for a solo founder — with **three views** the user navigates between using a top navigation bar: **Tasks**, **Stats**, and **Settings**. The app starts on the Tasks view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Tasks**, **Stats**, **Settings**) switches the active view.

**Tasks** — the main task list.
- An input labeled **Task name** and a dropdown (select) labeled **Priority** with options **high**, **med**, and **low** (default: **med**), plus an **Add task** button. Ignore a blank task name.
- Each task shows its name and priority, a **Done** toggle checkbox (unchecked = not done, checked = done), and a **Delete** button.
- A filter control: a dropdown labeled **Filter by priority** with options **all**, **high**, **med**, **low** (default: **all**). Selecting a value hides tasks that don't match (done tasks are still shown if they match).
- The count of tasks currently visible in the list is shown as `Showing: N tasks` (updated live when the filter changes).

**Stats** — a read-only summary derived from ALL tasks (ignoring the filter):
- `Total: N`
- `Done: N`
- `Remaining: N`
- `Done: P%` where P is done ÷ total as a whole-number percent (0% when there are no tasks)
- `High: N`, `Med: N`, `Low: N` — count of tasks per priority (all tasks, regardless of done status)

**Settings**
- A **Toggle theme** button that switches between **light** and **dark** mode. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.
- A **Clear all tasks** button that removes every task immediately.

Seed the app with **no tasks** initially. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
