# Shopping cart with Context + multiple components

This task spans **5 files**.

An `Item` is `{ id: number; name: string; price: number }`. A `CartLine` is `{ item: Item; qty: number }`.

- `hooks/useCart.ts` — export `useCart()` returning `{ lines: CartLine[]; add: (item: Item) => void; remove: (id: number) => void; total: number }`. `add` appends a line with `qty: 1` if the item isn't in `lines`, otherwise increments `qty`. `remove(id)` removes the line entirely. `total = sum(line.item.price * line.qty)`.
- `components/CartContext.tsx` — exports `CartContext` (a React context whose value type matches `useCart`'s return) and `useCartContext()` which reads and throws if the context is null.
- `components/CartLine.tsx` — accepts `{ line: CartLine }`. Renders `<li data-testid={`line-${line.item.id}`}>{line.item.name} x{line.qty}<button data-testid={`remove-${line.item.id}`}>Remove</button></li>`. The remove button calls `useCartContext().remove(line.item.id)`.
- `components/ItemList.tsx` — accepts `{ items: Item[] }`. Renders one `<button data-testid={`add-${item.id}`}>` per item with text "Add {name}". Clicking calls `useCartContext().add(item)`.
- `components/Cart.tsx` (entry, default export) — accepts `{ items: Item[] }`. Instantiates `useCart()` and provides it via `CartContext.Provider`. Renders `ItemList`, then `<ul data-testid="cart-lines">` containing one `CartLine` per cart line, then `<span data-testid="cart-total">{total}</span>`.
