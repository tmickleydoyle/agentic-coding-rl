# Build a Deliverables Tracker app

Build a complete single-page React application — a simple deliverables tracking tool — with **three views** the user navigates between using a top navigation bar: **Deliverables**, **Summary**, and **Settings**. The app starts on the Deliverables view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Deliverables**, **Summary**, **Settings**) switches the active view.

**Deliverables** — a list of deliverable items with their status and due date.
- An input labeled **Item name** for the deliverable title.
- An input labeled **Due date** for the due date (any string is acceptable, e.g. `2024-12-31`).
- An **Add deliverable** button that adds the item with status **pending** (ignore blank item name or blank due date).
- Each deliverable row shows its name, its due date, and its current status (**pending** or **delivered**).
- Each row has a **Mark delivered** button (disabled if already delivered) and a **Delete** button that removes the item.
- A **Filter** control with three options rendered as buttons: **All**, **Pending**, **Delivered**. Clicking one filters the list to show only matching items (default: **All**).
- A live count summary line displayed as `Showing: N of T` where N is the number of items currently visible after filtering and T is the total number of items.

**Summary** — a read-only stats panel derived from the deliverables list:
- `Total: N` — total number of deliverables.
- `Pending: N` — number with status pending.
- `Delivered: N` — number with status delivered.
- `Delivery rate: P%` — delivered ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button that switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Reset all deliverables** button that clears every deliverable from the list.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
