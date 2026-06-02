# Build a Design Request Queue app

Build a complete single-page React application — an internal design request tracker — with **three views** the user navigates between using a top navigation bar: **Queue**, **Stats**, and **Settings**. The app starts on the Queue view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Queue**, **Stats**, **Settings**) switches the active view.

**Queue** — the main list of design requests.
- An input labeled **Title** and a dropdown labeled **Priority** (options: `low`, `medium`, `high`) plus an **Add request** button adds a new request (ignore a blank title). New requests start with status `new`.
- Each request shows its title, priority, and current status.
- Each request has a **Set in-progress** button that changes its status to `in-progress`, and a **Set done** button that changes its status to `done`. A request already at `done` should have its **Set done** button disabled. A request already at `in-progress` should have its **Set in-progress** button disabled.
- A dropdown labeled **Filter by status** (options: `all`, `new`, `in-progress`, `done`) filters the visible list. The count of currently visible requests is shown as `Showing: N`.
- The filter persists when navigating away and back.

**Stats** — a read-only summary derived from all requests (not affected by the filter):
- `Total: N`
- `New: N`
- `In-progress: N`
- `Done: N`
- `High priority: N`

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with **no initial requests** so counts start at zero.
