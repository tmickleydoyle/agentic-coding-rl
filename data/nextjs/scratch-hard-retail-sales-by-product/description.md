# Sales-by-product tracker for my corner shop

Hi! I run a small corner shop and I want one little web app to keep my **products** and my
**sales** together, and tell me which products actually make me money. Build it as a single-page
React app with **three views** reached from a top navigation bar: **Products**, **Sales**, and
**Report**. The app starts on **Products**. Everything is kept in memory and shared across the
three views.

Navigation: a nav bar with a button for each view (**Products**, **Sales**, **Report**).

**Products** — my catalog.
- A form with inputs labeled **Product name** and **Unit price** (a number), plus an **Add
  product** button. Adding creates a product (ignore a blank name; price defaults to 0 if blank
  or negative). 
- A list shows each product as `Name @ $Price`.

**Sales** — record a sale of a product.
- A **Product** selector that lists every product I have added (by name), an input labeled
  **Quantity** (a number), and a **Record sale** button. Recording a sale stores the sale against
  the chosen product at the product's current unit price. Ignore a sale whose quantity is not at
  least 1 (round down to a whole number), and ignore it if no product is selected.
- A list shows each sale as `Name x Qty = $LineTotal`, where LineTotal is price times quantity.

**Report** — the part I really care about: revenue per product.
- For **each product**, a line `Name: Units units, $Revenue` where Units is the total quantity
  sold of that product across all sales and Revenue is the total money from that product
  (sum of its line totals). Products with no sales still show, with `0 units, $0`.
- A summary line `Total revenue: $X` (sum of every sale's line total).
- A summary line `Top product: Name` naming the product with the highest revenue (when there is a
  tie, the one added first wins; show `Top product: none` when there is no revenue yet).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is just in-app state).
