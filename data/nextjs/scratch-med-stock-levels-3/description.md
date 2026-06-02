# Build a Stock Levels Manager

Build a complete single-page React application — a simple inventory management tool — with **three views** the user navigates between using a top navigation bar: **Inventory**, **Summary**, and **Settings**. The app starts on the Inventory view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Inventory**, **Summary**, **Settings**) switches the active view.

**Inventory** — the main product list view.
- An input labeled **Product name**, an input labeled **Unit price** (a number), an input labeled **On hand** (a number), and an input labeled **Reorder point** (a number), plus an **Add product** button. Ignore the submission if the product name is blank.
- Each product is shown in a list row with its name, its current on-hand quantity, its unit price, and its reorder point.
- Each row has a **+** button (labeled `Increase stock for <name>`) and a **−** button (labeled `Decrease stock for <name>`) that adjust the on-hand quantity by 1. On-hand must never go below 0 (disable the **−** button when on-hand is 0).
- When a product's on-hand quantity is **strictly less than** its reorder point, that row displays the text `LOW STOCK` as a visual flag.
- Each row also shows the line value formatted as `Value: $X.XX` (on-hand × unit price, two decimal places).
- Each row has a **Remove** button (labeled `Remove <name>`) that deletes the product.

**Summary** — a read-only stats view derived from the inventory:
- Shows `Total products: N`
- Shows `Low stock items: N` (count of products where on-hand < reorder point)
- Shows `Total inventory value: $X.XX` (sum of all on-hand × unit price, two decimal places)
- Shows `In stock: N` (products where on-hand >= reorder point)

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Reset inventory** button that clears all products.

Seed the app with these three products already in the list on first load:
1. Name: `Widget A`, unit price: `2.50`, on-hand: `100`, reorder point: `20`
2. Name: `Gadget B`, unit price: `15.00`, on-hand: `5`, reorder point: `10`
3. Name: `Doohickey C`, unit price: `7.99`, on-hand: `0`, reorder point: `5`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
