# Build a Release Checklist app

Build a complete single-page React application — a launch checklist tool for small teams — with **three views** the user navigates between using a top navigation bar: **Checklist**, **Summary**, and **Settings**. The app starts on the Checklist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Checklist**, **Summary**, **Settings**) switches the active view.

**Checklist** — the main task list view.
- An input labeled **Task name** and an input labeled **Owner** plus an **Add task** button adds a new checklist item (ignore if Task name is blank; Owner defaults to empty string if blank).
- Each task shows its title and owner (shown as `Owner: <name>` or `Owner: —` if none) and a checkbox labeled **Done** that toggles the task's completion.
- A **Filter** dropdown (labeled **Filter by owner**) lists `All` plus each distinct owner currently in the list; selecting one hides tasks whose owner does not match.
- The heading shows the count of remaining (not-done) tasks: `Tasks remaining: N`.

**Summary** — a read-only derived stats view.
- Shows `Total: N`, `Done: N`, `Remaining: N`, and `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no tasks).
- Shows a **By owner** section listing each distinct owner with the count of their remaining (not-done) tasks, formatted as `<owner>: N remaining` (use `(none)` for tasks with no owner).

**Settings**
- A **Toggle theme** button that switches between light and dark theme. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists as the user navigates.
- A **Reset checklist** button that clears all tasks from the list.

Seed the app with these three tasks already present on first render:
1. Title: `Write release notes`, Owner: `Alice`, done: false
2. Title: `Run smoke tests`, Owner: `Bob`, done: false
3. Title: `Update changelog`, Owner: `Alice`, done: false

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
