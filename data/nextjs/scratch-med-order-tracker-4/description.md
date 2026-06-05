# Build an Order Tracker app

Build a complete single-page React application — a small internal order management tool — with **three views** the user navigates between using a top navigation bar: **Orders**, **Summary**, and **Settings**. The app starts on the Orders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Orders**, **Summary**, **Settings**) switches the active view.

**Orders** — the main order list.
- An input labeled **Customer name** and a **Add order** button adds a new order with status `new` (ignore blank names).
- Each order row shows the customer name, the current status, and an **Advance** button that moves the order through statuses in order: `new → packing → shipped → delivered`. The **Advance** button is disabled once the status is `delivered`.
- A filter row has four buttons: **All**, **New**, **Packing**, **Shipped**, **Delivered** — clicking one filters the visible orders to only that status (or all). The active filter button shows the label with the count in parentheses for the matching status, e.g. clicking **New** shows `New (2)` on that button when there are 2 new orders. The **All** button always shows `All (N)` where N is total orders.
- Orders NOT matching the active filter are hidden but still counted in the Summary view.

**Summary** — a read-only stats panel (derived from ALL orders, ignoring the active filter).
- Shows the following text lines: `Total orders: N`, `New: N`, `Packing: N`, `Shipped: N`, `Delivered: N`, and `Completion: P%` where P is the number of delivered orders divided by total orders as a whole-number percent (0% when there are no orders).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view navigation.

Seed the app with NO initial orders. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
