'use client'
import type { Product } from '../lib/types'

export default function ProductCard({
  product,
  onView,
  onAdd,
}: {
  product: Product
  onView: (id: string) => void
  onAdd: (id: string) => void
}) {
  return (
    <li data-testid={`product-${product.id}`}>
      <span data-testid={`product-${product.id}-name`}>{product.name}</span>
      <span data-testid={`product-${product.id}-category`}>{product.category}</span>
      <span data-testid={`price-${product.id}`}>{product.price}</span>
      <button data-testid={`view-${product.id}`} onClick={() => onView(product.id)}>
        View
      </button>
      <button data-testid={`add-${product.id}`} onClick={() => onAdd(product.id)}>
        Add to cart
      </button>
    </li>
  )
}
