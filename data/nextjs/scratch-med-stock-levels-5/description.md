# Build a Stock Levels Manager

Build a complete single-page React application — a lightweight inventory tool for a small warehouse team — with **three views** the user navigates between using a top navigation bar: **Inventory**, **Summary**, and **Settings**. The app starts on the Inventory view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Inventory**, **Summary**, **Settings**) switches the active view.

**Inventory** — a list of products with stock management.
- A form with three inputs: **Product name** (text), **On hand** (number), and **Reorder point** (number), plus an **Add product** button. Ignore submissions where the product name is blank.
- Each product row shows: the product name, `On hand: N`, `Reorder point: N`, and a low-stock flag shown as the text **LOW STOCK** when the on-hand quantity is strictly less than the reorder point.
- Each row has a **+** button (aria-label `Increase [name]`) that adds 1 to on-hand and a **−** button (aria-label `Decrease [name]`) that subtracts 1 from on-hand (minimum 0, never goes below 0).
- Each row has a **Remove** button (aria-label `Remove [name]`) that deletes the product.
- The heading shows a live count: **`Products (N)`** where N is the current number of products.
- Pre-seed the list with these three products so tests can rely on them from the start:
  - Name: `Widgets`, On hand: `30`, Reorder point: `20`
  - Name: `Sprockets`, On hand: `5`, Reorder point: `10`
  - Name: `Bolts`, On hand: `100`, Reorder point: `50`

**Summary** — a read-only derived view:
- Show `Total products: N`
- Show `Low stock items: N` (items where on-hand < reorder point)
- Show `Total units on hand: N` (sum of all on-hand quantities)
- Show `Total inventory value: $V` where V is the sum of each product's on-hand quantity multiplied by a fixed unit price of **$2.50**, formatted to two decimal places (e.g. `Total inventory value: $337.50`).

**Settings** — a theme toggle:
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- Display the current theme as `Current theme: light` or `Current theme: dark`.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
