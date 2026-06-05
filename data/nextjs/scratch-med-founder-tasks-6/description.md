# Build a Founder Task Tracker

Build a complete single-page React application — a lightweight task manager for a solo founder — with **three views** the user navigates between using a top navigation bar: **Tasks**, **Stats**, and **Settings**. The app starts on the **Tasks** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Tasks**, **Stats**, **Settings**) switches the active view.

## Seed Data
The app starts with **no tasks**.

## Tasks view
- An input labeled **Task name** and a dropdown/select labeled **Priority** (options: `high`, `med`, `low`) plus an **Add task** button adds a new task (ignore a blank title). New tasks start as not done.
- Each task row shows its title, its priority label, a checkbox labeled **Done** that toggles the task's done state, and a **Delete** button that removes the task.
- A filter control: a set of buttons or a select labeled **Filter by priority** with options **All**, **High**, **Med**, **Low** — only tasks matching the selected priority (or all tasks when All is selected) are shown in the list.
- A summary line always visible on this view (below the filter, above the list): `Showing: N of M` where N is the number of tasks currently visible (after filtering) and M is the total number of tasks.
- When no tasks match the filter, show the text `No tasks to show`.

## Stats view
- Read-only derived stats, displayed as individual text lines:
  - `Total: N`
  - `Done: N`
  - `Remaining: N`
  - `High: N` (count of high-priority tasks)
  - `Med: N` (count of med-priority tasks)
  - `Low: N` (count of low-priority tasks)
  - `Done: P%` where P is done ÷ total as a whole-number percent (0% when there are no tasks)

## Settings view
- A **Toggle theme** button that switches between `light` and `dark`. The current theme is applied as a `data-theme` attribute on a root element, and persists as the user navigates.
- A **Reset all tasks** button that clears every task. After clicking it, navigating back to Tasks shows `Showing: 0 of 0` and the list is empty.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
