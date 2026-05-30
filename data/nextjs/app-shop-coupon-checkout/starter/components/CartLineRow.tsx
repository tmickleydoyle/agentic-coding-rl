'use client'
import type { JoinedLine } from '../hooks/useCheckout'

export default function CartLineRow(_props: {
  line: JoinedLine
  onQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
}) {
  // TODO: render name + line-subtotal-<id> + qty-input-<id> + remove-<id>.
  return <li data-testid={`cart-line-${_props.line.productId}`} />
}
