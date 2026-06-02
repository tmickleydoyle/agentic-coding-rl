# Build a Stock Levels Manager

Build a complete single-page React application for managing product inventory, with **three views** the user navigates between using a top navigation bar: **Inventory**, **Summary**, and **Settings**. The app starts on the Inventory view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Inventory**, **Summary**, **Settings**) switches the active view.

**Inventory** — the main product list.
- An input labeled **Product name** and an input labeled **Unit price** (a number) plus an **Add product** button adds a new product (ignore if name is blank or price is not a positive number). New products start with **0** units on hand and a reorder point of **10**.
- Each product row shows: its name, a **On hand: N** label (N is the current quantity), a **Reorder: N** label showing the reorder point, and a **Unit: $N.NN** label showing the unit price formatted to two decimal places.
- If a product's on-hand quantity is **strictly below** its reorder point, the row must display the text **Low stock** somewhere visible.
- Each product row has an **Increase** button (adds 1 to on-hand) and a **Decrease** button (subtracts 1, minimum 0).
- Each product row has a **Set reorder** input (labeled **Reorder point for PRODUCT** where PRODUCT is the product name) and a **Save reorder** button that updates the reorder point to the entered value (a non-negative integer; ignore invalid input).
- Seed the app with these three products on first render:
  - **Widget A**, unit price **$4.99**, on hand **5**, reorder point **10** (starts low stock)
  - **Widget B**, unit price **$12.50**, on hand **20**, reorder point **8**
  - **Gadget C**, unit price **$7.25**, on hand **0**, reorder point **5** (starts low stock)

**Summary** — a read-only dashboard computed from the Inventory:
- `Total products: N` — total number of products.
- `Total units: N` — sum of all on-hand quantities.
- `Low stock items: N` — count of products whose on-hand is strictly below reorder point.
- `Inventory value: $N.NN` — sum of (on-hand × unit price) for every product, formatted to two decimal places.

**Settings** — a simple preferences panel.
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.
- A **Show low stock only** checkbox; when checked, the Inventory view shows only products whose on-hand quantity is strictly below their reorder point (all products still count in Summary).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
