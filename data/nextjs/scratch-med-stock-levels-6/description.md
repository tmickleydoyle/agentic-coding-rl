# Build a Stock Levels Manager

Build a complete single-page React application for managing product inventory, with **three views** the user navigates between using a top navigation bar: **Inventory**, **Summary**, and **Settings**. The app starts on the Inventory view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Inventory**, **Summary**, **Settings**) switches the active view.

**Inventory** — the main product list.
- An input labeled **Product name** and an input labeled **Unit price** (a number), plus an **Add product** button. Ignore blank names or non-positive prices.
- New products start with **0** units on hand and a reorder point of **10**.
- Each product row shows: the product name, a **On hand: N** label (where N is the current quantity), a **Reorder: N** label (where N is the reorder point), and a **Low stock** badge that is visible only when the on-hand quantity is strictly below the reorder point.
- Each row has a **+** button (labeled `Increase [name]`) that adds 1 to on-hand, and a **−** button (labeled `Decrease [name]`) that subtracts 1 from on-hand but never goes below 0. The **−** button is disabled when on-hand is 0.
- Each row has a **Remove** button (labeled `Remove [name]`) that deletes the product.
- Seed the app with these three products already present (id 1, 2, 3):
  - **Widget A**, unit price **2.50**, on hand **5**, reorder point **10**
  - **Gadget B**, unit price **15.00**, on hand **12**, reorder point **8**
  - **Doohickey C**, unit price **7.00**, on hand **0**, reorder point **5**

**Summary** — a read-only derived dashboard computed from the Inventory:
- `Total products: N` — count of all products.
- `Total units: N` — sum of all on-hand quantities.
- `Low stock items: N` — count of products whose on-hand is strictly below their reorder point.
- `Total value: $N.NN` — sum of (on-hand × unit price) for all products, formatted with exactly two decimal places and a leading `$`.

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs. Routing is in-app state only.
