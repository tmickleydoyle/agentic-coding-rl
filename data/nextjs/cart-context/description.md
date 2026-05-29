# Shopping cart via React Context

This task spans **5 files**. A `CartProvider` holds cart state; a product list and a cart summary
both consume it and stay in sync.

A `Product` is `{ id: string; name: string; price: number }`.

- `components/types.ts` — exports `type Product = { id: string; name: string; price: number }` and
  `type CartLine = { product: Product; qty: number }`.
- `components/CartContext.tsx` — exports a `CartProvider` component (props: `{ children: ReactNode }`)
  and a `useCart()` hook returning `{ lines, add, remove, total, count }`:
  - `lines: CartLine[]` — one entry per distinct product currently in the cart, in the order each
    product was first added.
  - `add(product: Product): void` — adds one unit; if the product is already in the cart, increments
    its `qty`.
  - `remove(productId: string): void` — removes one unit; if `qty` reaches `0`, drops the line entirely.
  - `total: number` — sum of `price * qty` over all lines.
  - `count: number` — sum of `qty` over all lines.
  Calling `useCart()` outside a `CartProvider` must throw.
- `components/ProductList.tsx` — accepts `{ products: Product[] }`. Uses `useCart()`. Renders one
  `<button data-testid="add-<id>">Add {name}</button>` per product; clicking it calls `add(product)`.
- `components/CartSummary.tsx` — uses `useCart()`. Renders `<span data-testid="count">{count}</span>`,
  `<span data-testid="total">{total}</span>`, and for each line a
  `<div data-testid="line-<id>">` containing `<span data-testid="qty-<id>">{qty}</span>` and a
  `<button data-testid="remove-<id>">Remove</button>` calling `remove(id)`.
- `components/App.tsx` (entry, default export) — accepts `{ products: Product[] }`. Wraps
  `<ProductList products={products} />` and `<CartSummary />` in a single `<CartProvider>` so both
  share one cart.
