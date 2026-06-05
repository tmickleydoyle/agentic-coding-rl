# Build an Order Tracker app

Build a complete single-page React application — a small internal order management tool — with **three views** the user navigates between using a top navigation bar: **Orders**, **Summary**, and **Settings**. The app starts on the Orders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Orders**, **Summary**, **Settings**) switches the active view.

**Orders** — a list of customer orders.
- An input labeled **Customer name** and an **Add order** button adds a new order with status **new** (ignore a blank name).
- Each order shows the customer name and its current status.
- Each order has an **Advance** button that moves the order through the status pipeline: **new → packing → shipped → delivered**. The Advance button is disabled once the order is **delivered**.
- Above the list, show a status filter. The filter has four buttons labeled **All**, **new**, **packing**, **shipped**, and **delivered**. Clicking a filter button shows only orders with that status (or all orders for **All**). The active filter persists when navigating away and back.
- Below the filter buttons show a count line formatted exactly as `Showing: N order(s)` where N is the number of currently visible orders.
- The order list is sorted so the most recently added orders appear at the top.

**Summary** — a read-only dashboard derived from all orders (ignores the current filter):
- `Total orders: N`
- `New: N`
- `Packing: N`
- `Shipped: N`
- `Delivered: N`
- `Completion: P%` where P is the number of delivered orders divided by total orders, as a whole-number percent (0% when there are no orders).

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

The default export of `app/page.tsx` must be the root App component. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
