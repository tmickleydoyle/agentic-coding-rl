# Build a Design Request Queue app

Build a complete single-page React application — a lightweight internal tool for managing a design team's incoming requests — with **three views** the user navigates between using a top navigation bar: **Queue**, **Stats**, and **Settings**. The app starts on the Queue view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Queue**, **Stats**, **Settings**) switches the active view.

**Queue** — the main list of design requests.
- An input labeled **Title** and a dropdown labeled **Priority** (options: **low**, **medium**, **high**) plus an **Add request** button adds a new request. Ignore a blank title. New requests always start with status **new**.
- Each request shows its title, priority, and current status.
- Each request has a **Set in-progress** button (disabled if already in-progress or done) and a **Set done** button (disabled if already done).
- A dropdown labeled **Filter by status** with options **all**, **new**, **in-progress**, **done** filters the visible list. The default filter is **all**.
- Above the list, show live counts for each status as three separate text lines in the format: `New: N`, `In-progress: N`, `Done: N`.

**Stats** — a read-only summary derived from all requests (unaffected by the current filter):
- `Total requests: N`
- `New: N`
- `In-progress: N`
- `Done: N`
- `High priority: N`
- `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no requests).

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with these three requests already present on load:
- Title: **Logo redesign**, Priority: **high**, Status: **new**
- Title: **Banner artwork**, Priority: **medium**, Status: **in-progress**
- Title: **Icon set**, Priority: **low**, Status: **done**
