'use client'
import type { Product } from '../lib/types'

export default function ProductCard(_props: {
  product: Product
  onView: (id: string) => void
  onAdd: (id: string) => void
}) {
  // TODO: render the product name/category/price, a view-<id> and an add-<id> button.
  return <li data-testid={`product-${_props.product.id}`} />
}
