'use client'
import type { Product } from '../lib/types'

export default function ProductRow(_props: {
  product: Product
  onView: (id: string) => void
}) {
  // TODO: render name, qty, reorder point, a LOW alert when low, and a view-<id> button;
  // data-low on the <li>.
  return (
    <li data-testid={`product-${_props.product.id}`} data-low="false" />
  )
}
