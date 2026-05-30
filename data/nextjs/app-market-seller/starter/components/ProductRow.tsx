'use client'
import type { Product } from '../lib/types'

export default function ProductRow(_props: { product: Product }) {
  // TODO: render a product row with name/price/stock.
  return <li data-testid={`product-${_props.product.id}`} />
}
