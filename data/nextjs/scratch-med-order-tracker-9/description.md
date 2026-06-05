# Build an Order Tracker app

Build a complete single-page React application — an internal order management tool — with **three views** the user navigates between using a top navigation bar: **Orders**, **Summary**, and **Settings**. The app starts on the Orders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Orders**, **Summary**, **Settings**) switches the active view.

**Orders** — the main list of customer orders.
- An input labeled **Customer name** and an **Add order** button creates a new order with status `new` (ignore a blank name).
- Each order row shows the customer name, the current status, and an **Advance** button that moves the order through the sequence: `new → packing → shipped → delivered`. The **Advance** button is disabled when the order is already `delivered`.
- A dropdown (a `<select>`) labeled **Filter by status** lets the user filter the visible list. Options are: **All**, **new**, **packing**, **shipped**, **delivered**. Filtering only hides rows — it does not delete orders.
- The heading above the list reads `Orders (N)` where N is the count of currently **visible** (filtered) orders.

**Summary** — a read-only derived view:
- Shows `Total orders: N` (all orders, regardless of filter).
- Shows individual status counts as `New: N`, `Packing: N`, `Shipped: N`, `Delivered: N`.
- Shows `Delivered: P%` — no wait, instead shows `Completion: P%` where P is delivered ÷ total as a whole-number percent (0% when there are no orders).

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.
- A **Reset orders** button clears all orders (sets the list back to empty).

Seed the app with **no orders** on first load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
