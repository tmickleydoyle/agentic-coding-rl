# Build a Founder Task Tracker app

Build a complete single-page React application — a lightweight task tracker for a solo founder — with **three views** the user navigates between using a top navigation bar: **Tasks**, **Stats**, and **Settings**. The app starts on the Tasks view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Tasks**, **Stats**, **Settings**) switches the active view.

**Tasks** — the main list view.
- An input labeled **Task name** plus a **Priority** dropdown (options: `High`, `Medium`, `Low`) and an **Add task** button adds a new task (ignore a blank title). New tasks start as not done.
- A **Filter** dropdown with options `All`, `High`, `Medium`, `Low` filters the displayed list by priority. The filter persists when navigating away and back.
- Each task row shows its title, its priority label (`High`, `Medium`, or `Low`), a checkbox labeled **Done** that toggles the done state, and a **Delete** button that removes the task entirely.
- Below the list, show a summary line in the format `Showing: N of M` where N is the number of tasks currently displayed (after filter) and M is the total number of tasks.

**Stats** — a read-only derived summary:
- `Total tasks: N`
- `Done: N`
- `Not done: N`
- `Done: P%` where P is done ÷ total as a whole-number percent (0% when there are no tasks)
- `High priority: N`
- `Medium priority: N`
- `Low priority: N`

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.
- A **Clear all tasks** button removes every task from the list.

Seed the app with these three initial tasks so tests have data immediately:
1. Title: `Launch landing page`, Priority: `High`, Done: false
2. Title: `Set up analytics`, Priority: `Medium`, Done: false
3. Title: `Write onboarding email`, Priority: `Low`, Done: false

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).