'use client'
import { useShop } from '../../components/AppStateProvider'
import { useCheckout } from '../../hooks/useCheckout'

export default function ConfirmationPage() {
  const { appliedCode } = useShop()
  const { total, couponValid } = useCheckout()
  return (
    <section data-testid="page-confirmation">
      <h1>Confirmation</h1>
      <p data-testid="confirmation-message">Thank you</p>
      <span data-testid="confirm-total">{total}</span>
      {appliedCode && couponValid ? <span data-testid="confirm-code">{appliedCode}</span> : null}
    </section>
  )
}
