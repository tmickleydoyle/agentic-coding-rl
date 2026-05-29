'use client'
import { useCart } from './CartContext'

// TODO: render <span data-testid="count">{count}</span>, <span data-testid="total">{total}</span>,
// and per line a <div data-testid="line-<id>"> with <span data-testid="qty-<id>">{qty}</span> and a
// <button data-testid="remove-<id>">Remove</button> calling remove(id).
export default function CartSummary() {
  const { lines, remove, total, count } = useCart()
  return (
    <div>
      <span data-testid="count">{count}</span>
      <span data-testid="total">{total}</span>
    </div>
  )
}
