'use client'
import { useCart } from './CartContext'

export default function CartSummary() {
  const { lines, remove, total, count } = useCart()
  return (
    <div>
      <span data-testid="count">{count}</span>
      <span data-testid="total">{total}</span>
      {lines.map((l) => (
        <div key={l.product.id} data-testid={`line-${l.product.id}`}>
          <span>{l.product.name}</span>
          <span data-testid={`qty-${l.product.id}`}>{l.qty}</span>
          <button data-testid={`remove-${l.product.id}`} onClick={() => remove(l.product.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}
