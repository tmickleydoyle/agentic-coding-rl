# Build a Design Request Queue app

Build a complete single-page React application for managing a design request queue. It has **three views** the user navigates between using a top navigation bar: **Queue**, **Stats**, and **Settings**. The app starts on the Queue view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Queue**, **Stats**, **Settings**) switches the active view.

**Queue** — the main list of design requests.
- An input labeled **Title** and a priority selector labeled **Priority** (options: **low**, **medium**, **high**) plus an **Add request** button adds a new request (ignore a blank title). New requests start with status **new**.
- A filter row with a label **Filter by status** and four buttons: **All**, **new**, **in-progress**, **done** — clicking one filters the displayed list. The active filter button should be visually indicated with `aria-pressed="true"`.
- Each request shows its title, its current priority, and its current status.
- Each request has a **Status** selector (options: **new**, **in-progress**, **done**) that lets the user change its status in place.
- The heading above the list shows the current count of displayed (filtered) items, e.g. `Requests (3)`.

**Stats** — a read-only summary derived from ALL requests (ignoring the active filter):
- `Total: N`
- `New: N`
- `In Progress: N`
- `Done: N`
- `High Priority: N`
- `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no requests).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.
- A **Clear all requests** button that removes every request from the queue.

Seed the app with the following three requests already present on first render:
1. Title: **Homepage redesign**, Priority: **high**, Status: **in-progress**
2. Title: **Logo refresh**, Priority: **medium**, Status: **new**
3. Title: **Icon set**, Priority: **low**, Status: **done**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
