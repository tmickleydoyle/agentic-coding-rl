# Build a Release Checklist app

Build a complete single-page React application — a release launch checklist tool — with **three views** the user navigates between using a top navigation bar: **Checklist**, **Summary**, and **Settings**. The app starts on the Checklist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Checklist**, **Summary**, **Settings**) switches the active view.

**Checklist** — the main task management view.
- An input labeled **Task name** and an input labeled **Owner** plus an **Add task** button adds a new checklist item (ignore if Task name is blank; Owner defaults to empty string if not filled in).
- Each task shows its name, its owner (or blank if none), a **Mark done** / **Mark undone** toggle button that flips its completion state, and a **Delete** button that removes it.
- A heading at the top of the task list reads **Tasks (N)** where N is the total number of tasks.
- Below the heading, show the text `Remaining: N` where N is the count of incomplete tasks.
- When the **Hide completed** checkbox (labeled **Hide completed**) is checked, completed tasks are hidden from the list (they still count in the Summary). The checkbox is unchecked by default.

**Summary** — a read-only derived stats view.
- Shows `Total: N` — total task count.
- Shows `Done: N` — count of completed tasks.
- Shows `Remaining: N` — count of incomplete tasks.
- Shows `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no tasks).
- Shows a section **By Owner** listing each distinct owner and their remaining (incomplete) task count in the format `<Owner>: N remaining` sorted alphabetically by owner name. Tasks with no owner are grouped under the label **Unassigned**.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Clear all tasks** button that removes every task from the checklist.

Seed the app with these three initial tasks so tests have data to work with:
1. Name: `Write release notes`, Owner: `Alice`, done: false
2. Name: `Run smoke tests`, Owner: `Bob`, done: false
3. Name: `Update changelog`, Owner: `Alice`, done: false

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
