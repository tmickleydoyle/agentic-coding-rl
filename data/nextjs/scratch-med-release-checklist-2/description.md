# Build a Release Checklist app

Build a complete single-page React application — a release launch checklist tool — with **three views** the user navigates between using a top navigation bar: **Checklist**, **Summary**, and **Settings**. The app starts on the Checklist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Checklist**, **Summary**, **Settings**) switches the active view.

**Checklist** — a list of release tasks, each with a task name, owner, and done toggle.
- An input labeled **Task name** and an input labeled **Owner**, plus an **Add task** button, add a new task (ignore if Task name is blank; owner defaults to `Unassigned` if blank).
- Each task row shows the task name, the owner name, and a checkbox labeled **Done** that toggles the task between incomplete and complete.
- A heading shows the total count of remaining tasks: `Remaining: N`.
- Tasks that are done are visually distinguishable (e.g. a `data-done` attribute on the list item set to `"true"` or `"false"`).

**Summary** — a read-only dashboard computed from the checklist:
- `Total tasks: N`
- `Completed: N`
- `Remaining: N`
- `Completion: P%` where P is completed ÷ total as a whole-number percent (0% when there are no tasks).
- A section labeled **By Owner** that lists, for each distinct owner, one line in the format `<Owner>: N remaining` (owners with zero remaining tasks still appear if they have tasks, showing `<Owner>: 0 remaining`). Owners are listed in the order their first task was added.

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Hide completed** checkbox; when checked, tasks that are done are hidden on the Checklist view (they still count in Summary).

Seed the app with these three tasks already present on first load:
- Task name: `Write release notes`, Owner: `Alice`, done: false
- Task name: `Deploy to staging`, Owner: `Bob`, done: false
- Task name: `Smoke test`, Owner: `Alice`, done: false

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
