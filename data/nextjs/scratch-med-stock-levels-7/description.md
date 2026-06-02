# Build a Stock Levels app

Build a complete single-page React application — a small inventory management tool — with **three views** the user navigates between using a top navigation bar: **Inventory**, **Summary**, and **Settings**. The app starts on the Inventory view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Inventory**, **Summary**, **Settings**) switches the active view.

**Inventory** — the main product list.
- An input labeled **Product name**, an input labeled **Unit price** (a positive number), an input labeled **On hand** (a non-negative integer), and an input labeled **Reorder point** (a non-negative integer), plus an **Add product** button. Ignore submissions where the product name is blank or the numbers are not valid positive/non-negative values.
- Each product appears in a list row showing: its name, the current on-hand quantity, the reorder point, and a low-stock badge showing the text `Low stock` when on-hand ≤ reorder point (no badge when above).
- Each row has a **+** button (aria-label `Increase [name]`) and a **−** button (aria-label `Decrease [name]`) that adjust the on-hand quantity by 1; on-hand cannot go below 0.
- A filter control: a **Show low stock only** checkbox (aria-label `Show low stock only`). When checked, only products where on-hand ≤ reorder point are displayed in the list.
- The Inventory heading shows a live count of products currently displayed, like `Inventory (3)`. The count reflects the current filter.

**Summary** — a read-only derived dashboard showing:
- `Total products: N` — count of all products (ignoring filter).
- `Low stock items: N` — count of products where on-hand ≤ reorder point.
- `Total inventory value: $X.XX` — sum of (on-hand × unit price) across all products, formatted to 2 decimal places with a leading `$`.
- `Average on hand: N` — average on-hand rounded to the nearest whole number (0 when no products).

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view navigation.

Seed the app with these three products already in the list on first load:
- Name: `Widget A`, unit price: `2.50`, on hand: `10`, reorder point: `5`
- Name: `Gadget B`, unit price: `15.00`, on hand: `3`, reorder point: `8`
- Name: `Doohickey C`, unit price: `7.25`, on hand: `0`, reorder point: `0`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
