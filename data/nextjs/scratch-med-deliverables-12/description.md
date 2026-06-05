# Build a Deliverables Tracker app

Build a complete single-page React application — a simple deliverables tracker for a small team — with **three views** the user navigates between using a top navigation bar: **Deliverables**, **Summary**, and **Settings**. The app starts on the Deliverables view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Deliverables**, **Summary**, **Settings**) switches the active view.

**Deliverables** — the main list of deliverable items.
- An input labeled **Item name** and an input labeled **Due date** plus an **Add item** button adds a new deliverable with status `pending` (ignore a blank item name).
- Each deliverable shows its name, due date, and current status (`pending` or `delivered`).
- Each deliverable has a **Mark delivered** button (disabled when already `delivered`) and a **Delete** button that removes the item entirely.
- A filter control: a button labeled **Show: All** toggles to **Show: Pending** and back — when set to **Show: Pending**, only `pending` items are shown in the list (delivered items are hidden).
- The heading shows the count of currently visible items, like `Deliverables (3)`.

**Summary** — a read-only dashboard derived from all deliverables (not affected by the filter):
- `Total: N` — total number of deliverables
- `Delivered: N` — count of delivered items
- `Pending: N` — count of pending items
- `Progress: P%` — delivered ÷ total as a whole-number percent (show `0%` when there are no items)

**Settings**
- A **Toggle theme** button that switches between light and dark mode. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.

Seed the app with **no initial items** (empty state). Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
