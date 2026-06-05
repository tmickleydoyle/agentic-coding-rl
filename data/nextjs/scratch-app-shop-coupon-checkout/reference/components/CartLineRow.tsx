'use client'
import type { JoinedLine } from '../hooks/useCheckout'

export default function CartLineRow({
  line,
  onQty,
  onRemove,
}: {
  line: JoinedLine
  onQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`cart-line-${line.productId}`}>
      <span data-testid={`cart-line-${line.productId}-name`}>{line.name}</span>
      <span data-testid={`line-subtotal-${line.productId}`}>{line.subtotal}</span>
      <input
        type="number"
        data-testid={`qty-input-${line.productId}`}
        value={line.qty}
        onChange={(e) => {
          const raw = e.target.value
          if (raw === '') return
          onQty(line.productId, Number(raw))
        }}
      />
      <button data-testid={`remove-${line.productId}`} onClick={() => onRemove(line.productId)}>
        Remove
      </button>
    </li>
  )
}
