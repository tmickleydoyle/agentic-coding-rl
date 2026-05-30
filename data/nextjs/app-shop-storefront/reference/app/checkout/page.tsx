'use client'
import { useState } from 'react'
import { useShop } from '../../components/AppStateProvider'
import { useCart } from '../../hooks/useCart'

export default function CheckoutPage() {
  const { clearCart } = useShop()
  const { count, subtotal, tax, total } = useCart()
  const [placed, setPlaced] = useState(false)

  if (count === 0 && !placed) {
    return (
      <section data-testid="page-checkout">
        <h1>Checkout</h1>
        <p data-testid="checkout-empty">Nothing to check out.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-checkout">
      <h1>Checkout</h1>
      <span data-testid="summary-count">{count}</span>
      <span data-testid="summary-subtotal">{subtotal}</span>
      <span data-testid="summary-tax">{tax}</span>
      <span data-testid="summary-total">{total}</span>
      {placed ? (
        <p data-testid="order-confirmed">Order confirmed.</p>
      ) : (
        <button
          data-testid="place-order"
          onClick={() => {
            clearCart()
            setPlaced(true)
          }}
        >
          Place order
        </button>
      )}
    </section>
  )
}
