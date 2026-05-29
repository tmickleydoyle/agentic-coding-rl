import type { Product } from './types'

export default function ProductCard({ product }: { product: Product }) {
  const { id, name, price, inStock } = product
  return (
    <article
      data-testid={`card-${id}`}
      aria-disabled={!inStock ? 'true' : undefined}
    >
      <h3 data-testid={`name-${id}`}>{name}</h3>
      <span data-testid={`price-${id}`}>${price}</span>
      <span data-testid={`stock-${id}`}>{inStock ? 'In stock' : 'Out of stock'}</span>
    </article>
  )
}
