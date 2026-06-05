# Build an Order Tracker app

Build a complete single-page React application — an internal order management tool for a small shop — with **three views** the user navigates between using a top navigation bar: **Orders**, **Summary**, and **Settings**. The app starts on the Orders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Orders**, **Summary**, **Settings**) switches the active view.

**Orders** — a list of customer orders.
- An input labeled **Customer name** and an **Add order** button adds a new order with status `new` (ignore a blank name).
- Each order row shows the customer name, the current status, and an **Advance** button that moves the order through the status pipeline: `new → packing → shipped → delivered`. The **Advance** button is disabled when the order has reached `delivered`.
- A dropdown (a `<select>`) labeled **Filter by status** lets the user filter the visible list to one of: `all`, `new`, `packing`, `shipped`, `delivered`. The default is `all`.
- Only orders matching the active filter are shown in the list. The count shown next to the filter reflects matching orders: **`Showing: N`** appears below the filter.

**Summary** — a read-only derived view:
- Shows the total count of all orders as **`Total orders: N`**.
- Shows a count per status as four lines: **`New: N`**, **`Packing: N`**, **`Shipped: N`**, **`Delivered: N`**.
- Shows the delivered percentage as **`Delivered: P%`** where P is delivered ÷ total as a whole-number percent (0% when there are no orders). This line uses the label **`Delivery rate: P%`** (e.g. `Delivery rate: 50%`).

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.
- Displays the current theme: **`Current theme: light`** or **`Current theme: dark`**.

Seed the app with **no orders** on first load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
