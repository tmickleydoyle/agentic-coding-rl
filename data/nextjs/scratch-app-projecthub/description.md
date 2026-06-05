# Build a project management app

Build a complete single-page React application — a small project management tool — with **four
views** the user navigates between using a top navigation bar: **Board**, **Backlog**,
**Reports**, and **Settings**. The app starts on the Board. State is shared across all views and
kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Board**, **Backlog**, **Reports**,
**Settings**) switches the active view.

**Board** — a Kanban board with three columns: **To Do**, **Doing**, **Done** (in that order).
- An input labeled **New task** plus an **Add task** button adds a task to **To Do** (ignore a
  blank title).
- Each task shows its title and has **Move … left** / **Move … right** controls that move it
  between adjacent columns; left is disabled in To Do, right is disabled in Done.
- Each column heading shows its name and a live count, like `To Do (2)`.

**Backlog** — a list of ideas not yet scheduled.
- An input labeled **Backlog idea** plus an **Add idea** button adds an idea (ignore blank).
- Each idea has a **Promote** control that removes it from the backlog and adds it as a new task
  in the Board's **To Do** column.

**Reports** — a read-only summary of the board, shown as text lines:
`Total tasks: N`, `To Do: N`, `Doing: N`, `Done: N`, and `Completion: P%` where P is done ÷ total
as a whole-number percent (0% when there are no tasks).

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is
  applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists
  as the user navigates between views.
- A **Show completed** checkbox; when unchecked, tasks in the Done column are hidden on the Board
  (they still count in Reports).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
