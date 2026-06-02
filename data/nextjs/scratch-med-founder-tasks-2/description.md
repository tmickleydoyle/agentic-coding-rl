# Build a Founder Task Tracker

Build a complete single-page React application — a simple task management tool for a solo founder — with **three views** the user navigates between using a top navigation bar: **Tasks**, **Stats**, and **Settings**. The app starts on the Tasks view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Tasks**, **Stats**, **Settings**) switches the active view.

**Tasks** — the main task list.
- An input labeled **Task name** plus a **Priority** dropdown (options: `High`, `Medium`, `Low`) and an **Add task** button. Ignore blank task names.
- Each task is displayed in a list and shows its title, its priority label, and a **Mark done** / **Mark undone** toggle button (when the task is done, the button reads **Mark undone**; when not done, it reads **Mark done**).
- A **Filter** dropdown (labeled **Filter by priority**) with options: `All`, `High`, `Medium`, `Low`. When a filter is selected, only tasks with that priority are shown (or all tasks when `All` is selected). The filter persists when navigating away and back.
- Each task also has a **Delete** button that removes it permanently.
- Above the list, show a live count in the format `Showing: N tasks` reflecting the currently filtered count.

**Stats** — a read-only summary derived from all tasks (ignoring the active filter):
- `Total: N`
- `High: N`
- `Medium: N`
- `Low: N`
- `Done: N`
- `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no tasks).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists across navigation.
- A **Clear all tasks** button that removes every task. After clearing, navigating to Stats should show all zeros.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs. Routing is in-app state.