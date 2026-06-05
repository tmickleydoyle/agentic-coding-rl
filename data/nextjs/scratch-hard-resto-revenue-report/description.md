# Build a menu & order-revenue app for my restaurant

I run a small bistro and I need one app with **three views** I can switch between using a top
nav bar: **Menu**, **Orders**, and **Revenue**. The app opens on **Menu**. Everything is shared
across the views and kept in memory.

Navigation: a nav bar with a button for each view (**Menu**, **Orders**, **Revenue**).

**Menu** — my list of dishes I can sell.
- A form with an input labeled **Dish name** and an input labeled **Price** (a number).
  An **Add dish** button adds it. Ignore a blank name or a price that is not greater than zero.
- The seeded menu starts empty.
- Each dish shows as a line `Dish — $Price` (use a regular hyphen with spaces).

**Orders** — a ticket is a single dish ordered some number of times.
- A **Dish** selector listing every dish currently on the Menu (by name), an input labeled
  **Quantity** (a number), and an **Add to order** button. Ignore a quantity that is not a
  whole number of at least 1. If there are no dishes yet, adding does nothing.
- Each placed ticket shows as a line `Qty × Dish = $LineTotal` where LineTotal is Price × Qty
  (for example `3 × Burger = $27`). Use the multiplication sign × between quantity and dish.
- Below the tickets show `Order total: $Total`, the sum of every ticket's line total.

**Revenue** — a read-only cross-view report, one line per dish that has actually been ordered,
sorted by revenue from highest to lowest (break ties by dish name, A to Z):
- `Dish: $Revenue (Qty sold)` where Revenue is the total money that dish brought in across all
  tickets and Qty sold is the total quantity ordered (for example `Burger: $27 (3 sold)`).
- Dishes never ordered do not appear.
- A final line `Top seller: Dish` naming the dish with the highest revenue, or
  `Top seller: none` when nothing has been ordered yet.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
