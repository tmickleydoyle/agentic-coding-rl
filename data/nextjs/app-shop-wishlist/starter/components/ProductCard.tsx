'use client'
import type { Product } from '../lib/types'

export default function ProductCard(_props: {
  product: Product
  wished: boolean
  onToggleWish: (id: string) => void
  onAdd: (id: string) => void
}) {
  // TODO: render name/category/price, a wish-<id> toggle (reflecting wished) and add-<id>.
  return <li data-testid={`product-${_props.product.id}`} data-wished="false" />
}
