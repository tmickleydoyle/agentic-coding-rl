# Product list with card subcomponent

This task spans **3 files**:

- `components/types.ts` — exports a TypeScript type `Product = { id: string; name: string; price: number; inStock: boolean }`.
- `components/ProductCard.tsx` — accepts a `product: Product` prop. Renders `<article data-testid="card-<id>">` containing:
  - `<h3 data-testid="name-<id>">` with the product's name.
  - `<span data-testid="price-<id>">` formatted as `"$<price>"`.
  - When `inStock` is `true`: a `<span data-testid="stock-<id>">"In stock"</span>`.
  - When `inStock` is `false`: a `<span data-testid="stock-<id>">"Out of stock"</span>` AND the article must have `aria-disabled="true"`.
- `components/ProductList.tsx` (entry, default export) — accepts `products: Product[]`. Renders `<section data-testid="list">` containing one `ProductCard` per product. Also renders `<span data-testid="count">` showing the number of in-stock products.

Both `ProductCard` and `ProductList` must import the `Product` type from `./types`.
