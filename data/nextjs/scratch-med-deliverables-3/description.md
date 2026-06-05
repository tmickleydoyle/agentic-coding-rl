# Build a Deliverables Tracker app

Build a complete single-page React application — a lightweight deliverables tracker for a small agency — with **three views** the user navigates between using a top navigation bar: **Deliverables**, **Summary**, and **Settings**. The app starts on the Deliverables view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Deliverables**, **Summary**, **Settings**) switches the active view.

**Deliverables** — the main list view for managing deliverable items.
- An input labeled **Item name** and an input labeled **Due date** (a plain text input, e.g. `2024-06-30`), plus an **Add** button. Clicking **Add** with a non-blank item name adds a new deliverable with status `pending` (ignore a blank item name; due date may be empty).
- A filter control: two buttons labeled **All** and **Pending** that filter the visible list. Default filter is **All**.
- Each deliverable row shows its name, its due date (or empty string if none), and its status (`pending` or `delivered`). Each row also has a **Mark delivered** button (disabled when the item is already `delivered`) and a **Delete** button that removes the item entirely.
- A summary line below the list reads `Showing X of Y` where X is the count of items currently visible (after filter) and Y is the total count of all items.

**Summary** — a read-only stats view derived from the deliverables list.
- Shows the following text lines: `Total: N`, `Pending: N`, `Delivered: N`, and `Delivered: P%` where P is delivered ÷ total as a whole-number percent (0% when there are no items).

**Settings** — a simple preferences view.
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
