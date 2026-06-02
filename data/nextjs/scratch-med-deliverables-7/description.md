# Build a Deliverables Tracker app

Build a complete single-page React application — a simple deliverables tracker for a small team — with **three views** the user navigates between using a top navigation bar: **Deliverables**, **Summary**, and **Settings**. The app starts on the **Deliverables** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Deliverables**, **Summary**, **Settings**) switches the active view.

**Deliverables** — the main list view.
- An input labeled **Item** for the deliverable name, an input labeled **Due date** for the due date (plain text, e.g. `2024-06-30`), and an **Add deliverable** button. Ignore a blank item name.
- Each deliverable shows its name, its due date, and its current status (**pending** or **delivered**).
- Each deliverable has a **Mark delivered** button (disabled if already delivered) and a **Mark pending** button (disabled if already pending).
- A filter row has two buttons: **Show all** and **Show pending**. When **Show pending** is active, only deliverables with status `pending` are shown in the list. Both filter buttons are always visible.
- The heading above the list always reads `Deliverables (N)` where N is the count of items currently visible (respecting the active filter).

**Summary** — a read-only stats view computed from all deliverables (ignoring the filter).
- Shows the following lines of text:
  - `Total: N` — total number of deliverables
  - `Pending: N` — count with status pending
  - `Delivered: N` — count with status delivered
  - `Delivered: P%` — delivered ÷ total as a whole-number percent (0% when there are no deliverables)

**Settings**
- A **Toggle theme** button switches the app theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates.
- The button label shows the current theme, e.g. `Toggle theme (current: light)`.

Seed the app with **no deliverables** on first load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).