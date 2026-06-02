# Build an Order Tracker app

Build a complete single-page React application — a small internal order management tool — with **three views** the user navigates between using a top navigation bar: **Orders**, **Summary**, and **Settings**. The app starts on the Orders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Orders**, **Summary**, **Settings**) switches the active view.

**Orders** — the main list of customer orders.
- An input labeled **Customer name** and an **Add order** button creates a new order with status `new` (ignore a blank name).
- Each order row shows the customer name, its current status, and an **Advance** button that moves the order through the status pipeline: `new → packing → shipped → delivered`. The **Advance** button is disabled once the order reaches `delivered`.
- A dropdown labeled **Filter by status** with options **All**, **new**, **packing**, **shipped**, **delivered** filters the visible list. The count of currently visible orders is shown as `Showing: N orders`.
- Each status column count is shown in the header area as individual status badges: `new (N)`, `packing (N)`, `shipped (N)`, `delivered (N)` — these always count ALL orders regardless of the filter.

**Summary** — a read-only derived view.
- Shows `Total orders: N`, `New: N`, `Packing: N`, `Shipped: N`, `Delivered: N`.
- Shows `Delivered: P%` as a whole-number percentage of delivered ÷ total (0% when no orders).
- Wait — to avoid the duplicate label issue, show delivered percentage as its own line: `Fulfillment rate: P%`.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with these three orders on first load:
- Customer `Alice`, status `new`
- Customer `Bob`, status `packing`
- Customer `Carol`, status `shipped`
