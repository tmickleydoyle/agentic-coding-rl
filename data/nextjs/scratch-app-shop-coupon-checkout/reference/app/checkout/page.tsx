'use client'
import { useShop } from '../../components/AppStateProvider'
import { useCheckout } from '../../hooks/useCheckout'

export default function CheckoutPage() {
  const { appliedCode, navigate } = useShop()
  const { count, subtotal, discount, total, couponValid } = useCheckout()

  if (count === 0) {
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
      <span data-testid="summary-subtotal">{subtotal}</span>
      <span data-testid="summary-discount">{discount}</span>
      <span data-testid="summary-total">{total}</span>
      {appliedCode && couponValid ? <span data-testid="summary-code">{appliedCode}</span> : null}
      <button data-testid="place-order" onClick={() => navigate('confirmation')}>
        Place order
      </button>
    </section>
  )
}
