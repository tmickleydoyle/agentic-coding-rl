# Build a Release Checklist app

Build a complete single-page React application — a launch checklist tool — with **three views** the user navigates between using a top navigation bar: **Checklist**, **Summary**, and **Settings**. The app starts on the Checklist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Checklist**, **Summary**, **Settings**) switches the active view.

**Checklist** — the main task list view.
- An input labeled **Task name** and an input labeled **Owner** plus an **Add task** button adds a new checklist item (ignore if either field is blank).
- Each task shows its name, its owner, and a checkbox labeled **Done** that toggles the task's completion state.
- A filter control: a set of buttons labeled **All**, **Pending**, and **Completed** that filter which tasks are shown (default: **All**).
- A heading that shows the overall progress: `Completion: P%` where P is the number of completed tasks divided by total tasks as a whole-number percent (show `Completion: 0%` when there are no tasks).
- Pre-seed the app with these three tasks so tests have stable data to work with:
  - Task name: `Write release notes`, Owner: `Alice`, done: false
  - Task name: `Deploy to staging`, Owner: `Bob`, done: false
  - Task name: `Notify stakeholders`, Owner: `Alice`, done: false

**Summary** — a read-only stats view derived from the checklist:
- Shows `Total tasks: N`
- Shows `Completed: N`
- Shows `Remaining: N`
- Shows `Completion: P%` (same formula as above)
- Shows a per-owner remaining count section headed **By owner**, listing each owner who has at least one incomplete task as: `<Owner>: N remaining` (e.g. `Alice: 2 remaining`).

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
