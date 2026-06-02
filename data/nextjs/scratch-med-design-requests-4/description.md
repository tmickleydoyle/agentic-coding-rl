# Build a Design Request Queue app

Build a complete single-page React application — a design request queue tool — with **three views** the user navigates between using a top navigation bar: **Queue**, **Stats**, and **Settings**. The app starts on the Queue view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Queue**, **Stats**, **Settings**) switches the active view.

**Queue** — a list of design requests.
- An input labeled **Title** and a dropdown labeled **Priority** (options: `low`, `medium`, `high`) plus an **Add request** button adds a new request. Ignore a blank title. New requests always start with status `new`.
- Each request shows its title, priority, and status.
- Each request has a **Set in-progress** button (disabled if status is already `in-progress`) and a **Set done** button (disabled if status is already `done`).
- Above the list, show three filter buttons: **All**, **new**, **in-progress**, **done**. Clicking one filters the visible list to only requests with that status (All shows everything).
- Below the filter buttons, show a live count line formatted exactly as `Showing: N requests` where N is the number of currently visible (filtered) requests.
- Each status filter button also shows a count in parentheses, e.g. `new (2)`, `in-progress (1)`, `done (0)`, and `All (3)` — always counting across ALL requests regardless of the active filter.

**Stats** — a read-only summary derived from all requests:
- `Total: N`
- `New: N`
- `In Progress: N`
- `Done: N`
- `High Priority: N` (count of requests with priority `high`, regardless of status)
- `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no requests).

**Settings**
- A **Toggle theme** button that switches between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.

Seed the app with NO initial requests (empty list). Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.