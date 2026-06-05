# Build a Stock Levels Manager

Build a complete single-page React application — a lightweight inventory tool for a small warehouse team — with **three views** the user navigates between using a top navigation bar: **Inventory**, **Summary**, and **Settings**. The app starts on the Inventory view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Inventory**, **Summary**, **Settings**) switches the active view.

**Inventory** — a list of products with stock controls.
- An input labeled **Product name**, an input labeled **Unit price**, and an **Add product** button add a new product. New products start with an on-hand quantity of **0** and a reorder point of **10**. Ignore a blank name or a non-positive price.
- Each product row shows:
  - The product name.
  - `On hand: N` where N is the current quantity.
  - `Reorder at: N` where N is the reorder point.
  - A **+** button and a **−** button to increase/decrease on-hand quantity by 1 (quantity cannot go below 0).
  - If on-hand is strictly less than the reorder point, show the text **LOW STOCK** on that row.
  - A **Remove** button that deletes the product.
- The heading above the list reads **Inventory (N)** where N is the total number of products.

Seed the app with these three products on first load (use these exact names, prices, on-hand quantities, and reorder points):
- **Widget A** — price $2.50, on hand 20, reorder at 10
- **Gadget B** — price $15.00, on hand 5, reorder at 8
- **Doohickey C** — price $7.75, on hand 8, reorder at 15

**Summary** — a read-only dashboard computed from the current inventory:
- `Total products: N`
- `Low stock items: N` (products where on-hand < reorder point)
- `Total inventory value: $D` where D is the sum of (price × on-hand) for all products, formatted to two decimal places (e.g. `Total inventory value: $185.00`).
- `Average unit price: $D` formatted to two decimal places; shows `$0.00` when there are no products.

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Reset inventory** button restores the three seeded products and discards any changes.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
