# Build a Stock Levels Manager

Build a complete single-page React application — a lightweight inventory tool for a small warehouse team — with **three views** the user navigates between using a top navigation bar: **Inventory**, **Summary**, and **Settings**. The app starts on the Inventory view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Inventory**, **Summary**, **Settings**) switches the active view.

**Inventory** — the main product list.
- Seed the app with these three products already present:
  - Name: `Widget A`, On Hand: `50`, Reorder Point: `20`, Unit Price: `4.99`
  - Name: `Gadget B`, On Hand: `8`, Reorder Point: `15`, Unit Price: `12.50`
  - Name: `Doohickey C`, On Hand: `100`, Reorder Point: `30`, Unit Price: `1.75`
- An input labeled **Product name**, an input labeled **On hand**, an input labeled **Reorder point**, an input labeled **Unit price**, and an **Add product** button add a new product (ignore if name is blank or if on-hand / reorder-point / unit-price are not valid positive numbers).
- Each product row shows its name, its current on-hand quantity, its reorder point, and its unit price formatted as `$X.XX`.
- Each product row has an **Adjust** button. Clicking it reveals an inline input labeled **Adjust qty** (a signed integer, e.g. `-5` or `10`) and a **Confirm** button that adds that number to the current on-hand (clamped so on-hand never goes below 0). Clicking **Adjust** again on the same row (or on a different row) while the input is open closes the open one first.
- If a product's on-hand quantity is **strictly less than** its reorder point, the row displays the text **Low stock** next to the product name.
- Each product row also has a **Remove** button that deletes the product.
- A **Show low stock only** checkbox (label text: **Show low stock only**) above the list, when checked, filters the list to show only low-stock products.

**Summary** — a read-only derived dashboard:
- `Total products: N`
- `Low stock items: N`
- `Total inventory value: $X.XX` where the value is the sum of (on-hand × unit price) for every product, formatted to exactly two decimal places.
- `Low stock: P%` where P is low-stock count ÷ total products as a whole-number percentage (0% when there are no products).

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Reset inventory** button restores the three seeded products and discards any additions or adjustments.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).