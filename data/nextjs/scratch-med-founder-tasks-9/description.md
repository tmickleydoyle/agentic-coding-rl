# Build a Founder Task Tracker app

Build a complete single-page React application — a lightweight task manager for a solo founder — with **three views** the user navigates between using a top navigation bar: **Tasks**, **Stats**, and **Settings**. The app starts on the Tasks view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Tasks**, **Stats**, **Settings**) switches the active view.

**Tasks** — the main list view.
- An input labeled **Task name** and a dropdown labeled **Priority** (options: **High**, **Med**, **Low**) plus an **Add task** button adds a new task (ignore a blank title). New tasks default to not done.
- A filter control labeled **Filter by priority** with options **All**, **High**, **Med**, **Low** that filters the displayed list (does not affect Stats counts).
- Each task row shows its title, its priority label, a checkbox labeled **Done** that toggles the done state, and a **Delete** button that removes the task.
- A summary line beneath the list shows `Showing: N task(s)` where N is the number of currently visible tasks (after filtering).

**Stats** — a read-only derived summary:
- `Total: N` — total number of tasks regardless of filter or done state.
- `Done: N` — count of tasks where done is true.
- `Not done: N` — count of tasks where done is false.
- `Done: P%` — whole-number percentage of done tasks out of total (0% when there are no tasks).
- `High: N`, `Med: N`, `Low: N` — count of tasks per priority (regardless of done state).

**Settings**
- A **Toggle theme** button that switches between light and dark theme. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed no initial tasks; the app starts empty.
