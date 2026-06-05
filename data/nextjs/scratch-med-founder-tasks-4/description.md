# Build a Founder Task Tracker app

Build a complete single-page React application — a lightweight task tracker for a solo founder — with **three views** the user navigates between using a top navigation bar: **Tasks**, **Stats**, and **Settings**. The app starts on the Tasks view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Tasks**, **Stats**, **Settings**) switches the active view.

**Tasks** — a list of tasks with priority levels and done toggles.
- An input labeled **Task name** plus a `<select>` labeled **Priority** (options: `High`, `Medium`, `Low`) and an **Add task** button adds a new task (ignore a blank name).
- Each task shows its name and priority, and has a **Mark done** / **Mark undone** toggle button that toggles its done state. Done tasks display with a `(done)` label appended, e.g. `Fix login bug (done)`.
- A `<select>` labeled **Filter by priority** with options `All`, `High`, `Medium`, `Low` filters the visible list. The count of visible tasks is shown as `Showing: N tasks`.
- Tasks start as not done.

**Stats** — a read-only summary derived from all tasks (not filtered), shown as text lines:
  - `Total: N`
  - `Done: N`
  - `Remaining: N`
  - `Done: P%` where P is done ÷ total as a whole-number percent (0% when there are no tasks)
  - `High: N`, `Medium: N`, `Low: N` (counts of tasks by priority regardless of done state)

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the app with NO initial tasks. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
