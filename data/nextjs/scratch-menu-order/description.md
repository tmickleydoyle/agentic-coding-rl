# Build a Restaurant Order App

Build a single-page React application for ordering food at a restaurant.

## Menu

The app shows a fixed menu with the following items (name and price):

| Item | Price |
|------|-------|
| Burger | $8.99 |
| Pizza | $11.49 |
| Salad | $6.49 |
| Fries | $3.99 |
| Soda | $1.99 |

Each menu item is listed with its name, its price formatted like `$8.99`, and an **Add to order** button.

## Order Panel

There is an **Your Order** section that shows the items the user has added.

- Each order line shows the item name, a **quantity** (starting at 1), a **Remove** button, and the line subtotal formatted like `$8.99`.
- Clicking **Add to order** for an item already in the order increments its quantity by 1.
- Clicking **Remove** removes that item entirely from the order (regardless of quantity).
- Below the order lines, show the total as `Total: $0.00` (two decimal places, preceded by a dollar sign, with a `Total:` label). When the order is empty, the total is `Total: $0.00`.

## Placing the Order

- There is a **Place Order** button beneath the total.
- When the user clicks **Place Order** and there is at least one item in the order, a confirmation message `Order placed! Thank you.` appears on the page and the order is cleared (all items removed, total resets to `Total: $0.00`).
- If the order is empty when **Place Order** is clicked, nothing happens (no confirmation, no error).

State is in-memory only. Use only `react` and `react-dom` — no other libraries, no Next.js APIs. The root component is the default export of `app/page.tsx`.