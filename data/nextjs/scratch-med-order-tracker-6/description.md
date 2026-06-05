# Build an Order Tracker app

Build a complete single-page React application — a small order management tool for a shop — with **three views** the user navigates between using a top navigation bar: **Orders**, **Summary**, and **Settings**. The app starts on the Orders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Orders**, **Summary**, **Settings**) switches the active view.

**Orders** — the main list of customer orders.
- An input labeled **Customer name** and an **Add order** button creates a new order with status `new` (ignore a blank name).
- Each order row shows the customer name, the current status, and an **Advance** button that moves the order through the status pipeline: `new → packing → shipped → delivered`. The **Advance** button is disabled when the order is already `delivered`.
- A filter control labeled **Filter by status** (a `<select>`) with options: `all`, `new`, `packing`, `shipped`, `delivered`. Only orders matching the selected status are shown (when `all` is selected, every order is shown).
- Above the list, show a live count of currently visible orders as `Showing: N orders`.

**Summary** — a read-only dashboard derived from all orders (ignores the filter).
- Show the following lines of text:
  - `Total orders: N`
  - `New: N`
  - `Packing: N`
  - `Shipped: N`
  - `Delivered: N`
  - `Delivered: P%` where P is delivered ÷ total as a whole-number percent (0% when there are no orders) — display this line as `Fulfillment rate: P%`

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Seed the app with **no orders** on load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).