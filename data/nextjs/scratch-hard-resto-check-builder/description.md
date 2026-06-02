# Build a guest-check builder for my restaurant

I want one app with **three views** reached from a top nav bar: **Items**, **Check**, and
**Summary**. The app opens on **Items**. State is shared across the views and kept in memory.

Navigation: a nav bar with a button for each view (**Items**, **Check**, **Summary**).

Money is always shown with exactly two decimals and a leading `$` (for example `$9.00`,
`$12.50`). Tax is a flat **10%** added after any discount.

**Items** — the dishes a guest can order.
- A form with an input labeled **Name** and an input labeled **Price** (a number of dollars),
  and an **Add item** button. Ignore a blank name or a price that is not greater than zero.
- The menu starts empty. Each item shows as a line `Name — $Price` (use the em dash character —).

**Check** — the running guest check.
- An **Item** selector listing every menu item by name, an input labeled **Quantity** (a number),
  and an **Add to check** button. Ignore a quantity that is not a whole number of at least 1, and
  do nothing if there are no menu items.
- Each line shows as `Qty × Name — $LineTotal` where LineTotal is Price × Qty
  (for example `2 × Soup — $13.00`). Use × between quantity and name and an em dash before the price.
- An input labeled **Discount %** (a whole-number percent, 0–100, default treated as 0). A bad or
  empty value counts as 0 percent.
- Show `Subtotal: $X` (sum of all line totals).

**Summary** — the read-only bill breakdown, computed from the same check:
- `Subtotal: $X` — sum of every line total.
- `Discount: -$D` — the discount percent applied to the subtotal (0 when no discount).
- `Taxable: $U` — subtotal minus discount.
- `Tax: $T` — 10% of the taxable amount.
- `Total: $G` — taxable amount plus tax.
- All five money amounts rounded to the nearest cent. With an empty check every amount is `$0.00`.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
