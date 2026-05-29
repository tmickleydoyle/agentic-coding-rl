# Fix: Cart total ignores quantity

`components/Cart.tsx` renders a shopping cart from a fixed list of items, each with a
`price` and a `qty`. Each row shows the item name (`data-testid="name-<id>"`) and a
"+"/"-" quantity control (`data-testid="inc-<id>"` / `data-testid="dec-<id>"`, qty
clamps at 0). A total is shown as `data-testid="total"`, formatted to two decimals with
a leading `$`, e.g. `$12.50`.

**Bug:** The displayed total is wrong — it adds up the unit prices but ignores how many
of each item are in the cart. The total should be the sum of `price * qty` over all
items.

Find and fix the bug so the total reflects quantity. Keep the same `data-testid`
attributes and the `$0.00` formatting. Default export.
