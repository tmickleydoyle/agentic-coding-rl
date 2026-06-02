# Build a Design Request Queue app

Build a complete single-page React application — a design request queue manager — with **three views** the user navigates between using a top navigation bar: **Queue**, **Stats**, and **Settings**. The app starts on the Queue view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Queue**, **Stats**, **Settings**) switches the active view.

**Queue** — the main list of design requests.
- An input labeled **Title** and a dropdown labeled **Priority** (options: **low**, **medium**, **high**) plus an **Add request** button adds a new request. A new request always starts with status **new**. Ignore a blank title.
- Each request shows its title, priority, and a status badge.
- Each request has a **Status** dropdown (options: **new**, **in-progress**, **done**) that the user can change inline.
- A filter row has a dropdown labeled **Filter by status** with options **all**, **new**, **in-progress**, **done**. When a filter is active, only matching requests are shown in the list. The heading shows the filtered count like `Requests (3)`.
- Seed the app with NO initial requests (empty state).

**Stats** — a read-only summary derived from ALL requests (ignoring the filter):
- `Total: N`
- `New: N`
- `In Progress: N`
- `Done: N`
- `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no requests).

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
