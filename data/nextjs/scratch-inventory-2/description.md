# Build an Inventory Tracker

Build a single-page React application for tracking inventory items with stock levels and values.

## Initial Data

The app starts with the following items already loaded (in this order):

| Name | Stock | Price |
|------|-------|-------|
| Apples | 10 | 0.50 |
| Bananas | 3 | 0.25 |
| Cherries | 50 | 2.00 |

## What the app should do

### Adding items
- A user can add a new item using three fields: **Item name**, **Stock**, and **Price ($)**.
- A button labelled **Add item** submits the form.
- If the name is blank/whitespace, or the stock is negative, or the price is negative, do nothing.
- After a successful add, clear all three input fields.

### Stock controls
- Each row has a **+** button and a **−** button to increment or decrement that item's stock by 1.
- Stock cannot go below 0; the **−** button is disabled when stock is already 0.

### Low-stock warning
- Any item whose stock is **5 or below** is considered low-stock.
- Display the text **Low stock** somewhere visible in that item's row (and remove it when stock rises above 5).

### Table columns
The inventory is displayed as a table with these exact column headings (in order):
**Name**, **Stock**, **Price**, **Value**, **Status**, **Actions**

- **Value** for each row is `stock × price`, formatted as a dollar amount with two decimal places, e.g. `$5.00`.
- **Price** for each row is displayed with a leading `$` and two decimal places, e.g. `$0.50`.
- **Status** shows **Low stock** when stock ≤ 5, otherwise it is blank.

### Summary footer
- Below the table show a single line: `Total inventory value: $<amount>` where `<amount>` is the sum of all rows' values, formatted with two decimal places, e.g. `Total inventory value: $30.00`.
- This total updates immediately whenever stock changes or an item is added.

State is kept in memory (no backend, no persistence needed).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
