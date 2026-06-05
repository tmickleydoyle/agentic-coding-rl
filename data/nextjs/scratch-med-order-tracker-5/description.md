# Build an Order Tracker app

Build a complete single-page React application — a simple internal order tracking tool — with **three views** the user navigates between using a top navigation bar: **Orders**, **Summary**, and **Settings**. The app starts on the Orders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Orders**, **Summary**, **Settings**) switches the active view.

**Orders** — the main list of customer orders.
- An input labeled **Customer name** and an **Add order** button creates a new order with status `new` (ignore a blank customer name).
- Each order row shows the customer name, its current status, and an **Advance** button that moves the order through the status pipeline: `new` → `packing` → `shipped` → `delivered`. The **Advance** button is disabled when the order is already `delivered`.
- A filter row with a label **Filter by status** and five buttons: **All**, **New**, **Packing**, **Shipped**, **Delivered**. Only orders matching the active filter are shown (default filter is **All**).
- Below the filter buttons, show a live count in the format `Showing: N orders` reflecting how many orders are currently visible.
- Each order's status is displayed as plain text exactly as: `new`, `packing`, `shipped`, or `delivered`.

**Summary** — a read-only derived stats view.
- Displays the heading **Summary**.
- Shows total and per-status counts as text lines in exactly this format:
  - `Total orders: N`
  - `New: N`
  - `Packing: N`
  - `Shipped: N`
  - `Delivered: N`
  - `Delivered rate: P%` where P is delivered ÷ total as a whole-number percent (0% when there are no orders).

**Settings** — a simple preferences view.
- A **Toggle theme** button that switches between light and dark themes. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- The button label shows the current theme, e.g. `Toggle theme (current: light)` or `Toggle theme (current: dark)`.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state).

Seed the app with NO initial orders (empty list).
