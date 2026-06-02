# Build a Design Request Queue app

Build a complete single-page React application — a design request queue tool — with **three views** the user navigates between using a top navigation bar: **Queue**, **Stats**, and **Settings**. The app starts on the Queue view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Queue**, **Stats**, **Settings**) switches the active view.

**Queue** — the main list of design requests.
- An input labeled **Title** and a dropdown labeled **Priority** (options: `low`, `medium`, `high`) plus an **Add Request** button adds a new request. Ignore a blank title. New requests always start with status `new`.
- Each request shows its title, its priority, and its current status.
- Each request has a **Status** dropdown (options: `new`, `in-progress`, `done`) that updates that request's status immediately.
- A filter control: a dropdown labeled **Filter by status** with options `all`, `new`, `in-progress`, `done`. When a filter is active, only matching requests are shown.
- Above the list, show the counts for each status as: `New: N`, `In Progress: N`, `Done: N` (these always reflect the full dataset, not the filtered view).

**Stats** — a read-only summary of all requests:
- `Total: N` — total number of requests
- `New: N` — count with status `new`
- `In Progress: N` — count with status `in-progress`
- `Done: N` — count with status `done`
- `High Priority: N` — count with priority `high`
- `Completion: P%` — done ÷ total as a whole-number percent (0% when there are no requests)

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with these three initial requests so tests can rely on them:
1. Title: `Logo redesign`, Priority: `high`, Status: `new`
2. Title: `Banner artwork`, Priority: `medium`, Status: `in-progress`
3. Title: `Icon set`, Priority: `low`, Status: `done`
