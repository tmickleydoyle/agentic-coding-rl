'use client'
import { useState } from 'react'
import { useMenu } from '../../components/AppStateProvider'
import { useMenuViews } from '../../hooks/useMenuViews'

export default function CheckoutPage() {
  const { cart, clearCart } = useMenu()
  const { total } = useMenuViews()
  const [confirmed, setConfirmed] = useState(false)

  const placeOrder = () => {
    if (cart.length === 0) return
    clearCart()
    setConfirmed(true)
  }

  return (
    <section data-testid="page-checkout">
      <h1>Checkout</h1>
      {confirmed ? <p data-testid="order-confirmed">Order placed!</p> : null}
      {cart.length === 0 ? (
        <p data-testid="checkout-empty">Nothing to order.</p>
      ) : (
        <>
          <p data-testid="checkout-total">{total}</p>
          <button data-testid="place-order" onClick={placeOrder}>
            Place order
          </button>
        </>
      )}
    </section>
  )
}
