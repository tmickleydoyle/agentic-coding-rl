# Build a Deliverables Tracker app

Build a complete single-page React application — a lightweight deliverables tracker for a small agency — with **three views** the user navigates between using a top navigation bar: **Deliverables**, **Summary**, and **Settings**. The app starts on the Deliverables view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Deliverables**, **Summary**, **Settings**) switches the active view.

**Deliverables** — a list of project deliverables.
- An input labeled **Item** for the deliverable name, an input labeled **Due date** for the due date (plain text field, any format), and an **Add** button adds a new deliverable (ignore blank item name). New deliverables start with status **pending**.
- A filter row with two buttons: **Show All** and **Show Pending**. Default is Show All.
- Each deliverable row shows its name and due date, a status badge showing either `pending` or `delivered`, and a **Mark delivered** button (disabled when already delivered).
- The heading above the list shows the current filter: `All deliverables (N)` when showing all, or `Pending deliverables (N)` when filtering pending — where N is the count of items currently shown.

**Summary** — a read-only stats panel derived from all deliverables (ignores the filter). Shows:
- `Total: N`
- `Delivered: N`
- `Pending: N`
- `Progress: P%` where P is delivered ÷ total as a whole-number percent (0% when there are no deliverables).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
