import type { Product } from './types'

// TODO: render the article with name/price/stock testids and aria-disabled when out of stock.
export default function ProductCard({ product }: { product: Product }) {
  return <article data-testid={`card-${product.id}`}></article>
}
