# Build a Deliverables Tracker app

Build a complete single-page React application — a simple deliverables tracker for a small team — with **three views** the user navigates between using a top navigation bar: **Deliverables**, **Summary**, and **Settings**. The app starts on the Deliverables view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Deliverables**, **Summary**, **Settings**) switches the active view.

**Deliverables** — the main list view.
- An input labeled **Item** for the deliverable name, an input labeled **Due date** for the due date (plain text, e.g. `2024-06-30`), and an **Add** button that adds a new deliverable with status **pending** (ignore entries where Item is blank).
- Each deliverable row shows its name, its due date, and its current status (`pending` or `delivered`).
- Each row has a **Mark delivered** button (disabled if already delivered) and a **Mark pending** button (disabled if already pending).
- A **Filter** control (a group of two buttons): **All** and **Pending only**. When **Pending only** is active, only deliverables with status `pending` are shown in the list. The filter defaults to **All**.
- The heading above the list shows the live count matching the current filter, e.g. `All (3)` or `Pending only (2)`.

**Summary** — a read-only derived view:
- Shows `Total: N`, `Delivered: N`, `Pending: N`, and `Delivered: P%` where P is delivered ÷ total as a whole-number percent (0% when there are no items).

**Settings** — a simple preferences view:
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
