# Shopping cart

Implement a client component `Cart` in `components/Cart.tsx`:

- Accepts `products: { id: string; name: string; price: number }[]` (price is in whole dollars).
- Renders a `<ul data-testid="catalog">` with one `<li>` per product containing the product's name and a `<button data-testid="add-<id>">` labeled `"Add"`.
- Renders a `<ul data-testid="cart">` showing one `<li>` per **distinct cart item** with:
  - The product name and its current quantity, formatted as `"<name> ×<qty>"`.
  - A `<button data-testid="remove-<id>">` labeled `"Remove"` next to it.
- Renders `<span data-testid="total">` with the running total formatted as `"$X"` (no decimals). Total starts at `$0`.
- Clicking "Add" for a product increments its quantity in the cart (and adds the line if not present). Clicking "Remove" decrements; when quantity reaches 0, the item line must be removed from the cart `<ul>`.

Default export.
