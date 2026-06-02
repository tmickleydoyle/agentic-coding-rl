# Build a Founder Task Tracker

Build a complete single-page React application — a lightweight task tracker for a solo founder — with **three views** the user navigates between using a top navigation bar: **Tasks**, **Stats**, and **Settings**. The app starts on the Tasks view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Tasks**, **Stats**, **Settings**) switches the active view.

**Tasks** — the main task list.
- An input labeled **Task name** and a dropdown labeled **Priority** (options: `high`, `med`, `low`) plus an **Add task** button adds a new task (ignore a blank task name). New tasks start as not done.
- A dropdown labeled **Filter by priority** with options `all`, `high`, `med`, `low` filters the displayed list. Selecting `all` shows every task.
- Each task row shows its title, its priority label, and a **Mark done** button that toggles the task's done state. When the task is already done, the button reads **Mark undone** instead.
- Below the list, show a live count of currently visible (filtered) tasks as `Showing: N tasks`.

**Stats** — a read-only summary derived from ALL tasks (ignoring the filter):
- `Total: N` — total number of tasks.
- `High: N`, `Med: N`, `Low: N` — count of tasks per priority.
- `Done: N` — total tasks marked done.
- `Done %: P%` — percentage of total tasks that are done, as a whole-number percent (0% when there are no tasks).

**Settings**
- A **Toggle theme** button switches the app theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute on a root element and persists as the user navigates.
- The button label shows the current theme, e.g. `Toggle theme (current: light)`.

Seed NO initial tasks — the list starts empty.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.