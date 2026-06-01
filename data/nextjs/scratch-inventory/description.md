# Build an Inventory Tracker

Build a single-page React application for tracking inventory items and their stock levels.

## Initial Data

The app starts with these items already loaded (in this order):

| Name        | Price  | Stock | Threshold |
|-------------|--------|-------|-----------|
| Widget A    | 5.00   | 10    | 5         |
| Gadget B    | 12.50  | 3     | 5         |
| Doohickey C | 8.75   | 7     | 5         |

## What the app should do

### Adding items
- A form at the top lets the user add a new item. It has three inputs: **Item name**, **Price**, and **Stock**, plus an **Add item** button.
- Clicking **Add item** with a blank name, a non-positive price, or a negative stock should do nothing. All three inputs clear after a successful add. New items use the default low-stock threshold of **5**.

### Per-item controls
- Each item is displayed in a row showing its name, its current stock, and (if stock is below the item's threshold) the text **Low stock** next to its name.
- Each row has an **Increase** button and a **Decrease** button. **Increase** adds 1 to stock. **Decrease** subtracts 1 from stock, but stock cannot go below **0** (the button is disabled when stock is 0).

### Summary row
- Below the item list, show two summary values:
  - **Total items: N** where N is the count of distinct items.
  - **Total value: $X** where X is the sum of (price × stock) for all items, formatted to two decimal places (e.g. `Total value: $143.25`).
- Both update immediately whenever stock changes or a new item is added.

### Low-stock flag
- If an item's current stock is **strictly below** its threshold (default 5), show the label **Low stock** inline with that item's name. The label appears and disappears as stock changes.

State is kept in memory (no backend, no persistence needed). Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
