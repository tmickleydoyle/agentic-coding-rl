'use client'
import type { Product } from '../lib/types'
import { isLow } from '../lib/types'

export default function ProductRow({
  product,
  onView,
}: {
  product: Product
  onView: (id: string) => void
}) {
  const low = isLow(product)
  return (
    <li data-testid={`product-${product.id}`} data-low={low ? 'true' : 'false'}>
      <span data-testid={`product-${product.id}-name`}>{product.name}</span>
      <span data-testid={`product-${product.id}-qty`}>{product.qty}</span>
      <span data-testid={`product-${product.id}-reorder`}>{product.reorderPoint}</span>
      {low ? <span data-testid={`product-${product.id}-alert`}>LOW</span> : null}
      <button data-testid={`view-${product.id}`} onClick={() => onView(product.id)}>
        View
      </button>
    </li>
  )
}
