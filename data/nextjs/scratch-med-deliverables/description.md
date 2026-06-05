# Build a Deliverables Tracker app

Build a complete single-page React application — a simple deliverables tracker for a small team — with **three views** the user navigates between using a top navigation bar: **Deliverables**, **Summary**, and **Settings**. The app starts on the Deliverables view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Deliverables**, **Summary**, **Settings**) switches the active view.

**Deliverables** — a list of deliverable items with their status and due date.
- An input labeled **Item name** for the deliverable title.
- An input labeled **Due date** (a plain text input) for the due date string.
- An **Add deliverable** button adds the item with a default status of **pending** (ignore a blank item name).
- Each deliverable row shows: its name, its due date, its current status (**pending** or **delivered**), and a **Mark delivered** button (shown only when status is pending) that flips the status to delivered.
- A filter control: a set of buttons labeled **All**, **Pending**, and **Delivered** that filter which items are shown in the list. The active filter button reflects the current selection.
- The list heading shows the count of currently visible items, e.g. `Showing: 3 items`.

**Summary** — a read-only stats panel computed from all deliverables:
- `Total: N` — total number of deliverables.
- `Pending: N` — count with status pending.
- `Delivered: N` — count with status delivered.
- `Progress: P%` — delivered ÷ total as a whole-number percent (0% when there are no deliverables).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
