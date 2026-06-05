# Build a Deliverables Tracker app

Build a complete single-page React application — a simple deliverables tracking tool for a small agency — with **three views** the user navigates between using a top navigation bar: **Deliverables**, **Summary**, and **Settings**. The app starts on the Deliverables view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Deliverables**, **Summary**, **Settings**) switches the active view.

**Deliverables** — the main list view.
- An input labeled **Item** for the deliverable name, an input labeled **Due date** for the due date (a plain text field, e.g. `2024-06-30`), a **Add deliverable** button that adds the item with status `pending` (ignore if the Item field is blank).
- A filter row with two buttons: **Show all** and **Show pending**. Default is Show all.
- Each deliverable shows its name, its due date, and its current status (`pending` or `delivered`).
- Each deliverable has a **Mark delivered** button (disabled when status is already `delivered`) and a **Delete** button that removes it from the list.
- When the active filter is **Show pending**, only items with status `pending` are shown (delivered items are hidden but not deleted).
- A summary line at the bottom of the view always reads `Delivered: X of Y` where X is the count of delivered items and Y is the total count (counts are never affected by the filter).

**Summary** — a read-only stats view derived from the deliverables list:
- Shows `Total: N`, `Pending: N`, `Delivered: N`, and `Completion: P%` where P is delivered ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists across navigation.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).