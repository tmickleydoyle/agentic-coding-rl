# Build a Stock Levels Manager

Build a complete single-page React application — a small inventory management tool — with **three views** the user navigates between using a top navigation bar: **Inventory**, **Summary**, and **Settings**. The app starts on the Inventory view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Inventory**, **Summary**, **Settings**) switches the active view.

**Inventory** — a list of products with their stock levels.
- An input labeled **Product name**, a number input labeled **On hand**, and a number input labeled **Reorder point**, plus an **Add product** button, adds a new product (ignore a blank name or negative on-hand/reorder-point values; treat empty number inputs as 0).
- Each product row shows its name, its on-hand quantity as `On hand: N`, its reorder point as `Reorder: N`, and its unit price as `Price: $N.NN`.
- A number input labeled **Unit price** (per product form) sets the price per unit in dollars (default 0, two decimal places in display).
- Each product row has a **+** button (aria-label `Increase <name>`) and a **−** button (aria-label `Decrease <name>`) that adjust on-hand quantity by 1; on-hand cannot go below 0.
- If a product's on-hand quantity is strictly less than its reorder point, the row shows the text **Low stock** next to the product name.
- The heading above the list reads `Products (N)` where N is the total number of products.
- Seed the app with these three products already in the list: **Widget A** (on hand: 5, reorder point: 10, unit price: 2.50), **Gadget B** (on hand: 20, reorder point: 8, unit price: 14.99), **Doohickey C** (on hand: 3, reorder point: 3, unit price: 7.00).

**Summary** — a read-only dashboard computed from the Inventory:
- Shows `Total products: N`.
- Shows `Low stock items: N` (products where on-hand is strictly less than reorder point).
- Shows `Total inventory value: $N.NN` (sum of on-hand × unit price for every product, formatted to exactly two decimal places).
- Shows `Average on hand: N.N` (mean on-hand quantity across all products, one decimal place; show `0.0` when there are no products).

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.
- A **Hide low stock** checkbox; when checked, products that are low stock are hidden on the Inventory view (they still count in Summary).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
