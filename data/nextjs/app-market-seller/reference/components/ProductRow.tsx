'use client'
import type { Product } from '../lib/types'

export default function ProductRow({ product }: { product: Product }) {
  return (
    <li data-testid={`product-${product.id}`}>
      <span data-testid={`product-${product.id}-name`}>{product.name}</span>
      <span data-testid={`product-${product.id}-price`}>{product.price}</span>
      <span data-testid={`product-${product.id}-stock`}>{product.stock}</span>
    </li>
  )
}
