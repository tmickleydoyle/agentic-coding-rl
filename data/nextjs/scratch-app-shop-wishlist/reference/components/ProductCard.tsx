'use client'
import type { Product } from '../lib/types'

export default function ProductCard({
  product,
  wished,
  onToggleWish,
  onAdd,
}: {
  product: Product
  wished: boolean
  onToggleWish: (id: string) => void
  onAdd: (id: string) => void
}) {
  return (
    <li data-testid={`product-${product.id}`} data-wished={wished ? 'true' : 'false'}>
      <span data-testid={`product-${product.id}-name`}>{product.name}</span>
      <span data-testid={`product-${product.id}-category`}>{product.category}</span>
      <span data-testid={`price-${product.id}`}>{product.price}</span>
      <button
        data-testid={`wish-${product.id}`}
        data-wished={wished ? 'true' : 'false'}
        onClick={() => onToggleWish(product.id)}
      >
        {wished ? 'Remove from wishlist' : 'Add to wishlist'}
      </button>
      <button data-testid={`add-${product.id}`} onClick={() => onAdd(product.id)}>
        Add to cart
      </button>
    </li>
  )
}
