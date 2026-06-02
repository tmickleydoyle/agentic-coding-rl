# Build an Order Tracker app

Build a complete single-page React application — an internal order management tool — with **three views** the user navigates between using a top navigation bar: **Orders**, **Summary**, and **Settings**. The app starts on the Orders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Orders**, **Summary**, **Settings**) switches the active view.

## Seed Data

Pre-populate the app with these three orders on startup:
- Customer **Alice**, status **new**
- Customer **Bob**, status **packing**
- Customer **Carol**, status **shipped**

---

**Orders** — the main list of orders.
- An input labeled **Customer name** plus an **Add order** button adds a new order with status **new** (ignore a blank name).
- Each order row shows the customer name and current status.
- Each order row has an **Advance** button that moves the order to the next status in the sequence: **new → packing → shipped → delivered**. The Advance button is disabled when the order is already **delivered**.
- A dropdown labeled **Filter by status** with options **All**, **new**, **packing**, **shipped**, **delivered** filters the visible list. Only matching orders are shown (the filter does NOT affect the counts in Summary).
- The heading above the list shows the count of currently visible orders, e.g. `Orders (3)` when all three are shown or `Orders (1)` when one matches the filter.

**Summary** — a read-only derived view:
- Shows `Total orders: N`
- Shows `New: N`
- Shows `Packing: N`
- Shows `Shipped: N`
- Shows `Delivered: N`
- Shows `Delivered: P%` as a whole-number percentage of total (0% when there are no orders), formatted as `Completion: P%`

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
