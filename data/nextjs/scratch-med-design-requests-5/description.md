# Build a Design Request Queue app

Build a complete single-page React application — a lightweight internal tool for managing a design team's incoming requests — with **three views** the user navigates between using a top navigation bar: **Queue**, **Stats**, and **Settings**. The app starts on the Queue view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Queue**, **Stats**, **Settings**) switches the active view.

**Queue** — the main list of design requests.
- An input labeled **Title** and a dropdown labeled **Priority** (options: **low**, **medium**, **high**) plus an **Add request** button adds a new request (ignore a blank title). New requests always start with status **new**.
- A dropdown labeled **Filter by status** with options **all**, **new**, **in-progress**, **done** filters the displayed list (default **all**).
- Each request shows its title, its priority, and its current status.
- Each request has a **Set new** button, a **Set in-progress** button, and a **Set done** button that update that request's status.
- The heading shows the count of currently displayed requests like `Requests (3)`.

**Stats** — a read-only derived summary, shown as text lines:
- `Total: N` — total number of requests
- `New: N` — requests with status new
- `In-progress: N` — requests with status in-progress
- `Done: N` — requests with status done
- `Done: P%` — percentage of total that are done, as a whole-number percent (0% when there are no requests), displayed exactly as `Done: P%`

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs. Routing is in-app state only.

## Seed data
Start with **no requests** — the queue is empty on first load.
