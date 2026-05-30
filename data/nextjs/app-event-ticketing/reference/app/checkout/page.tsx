'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function CheckoutPage() {
  const { events, selectedEventId, buy, navigate } = useApp()
  const event = events.find((e) => e.id === selectedEventId)
  const firstTier = event?.tiers[0]?.id ?? ''
  const [buyer, setBuyer] = useState('')
  const [tierId, setTierId] = useState(firstTier)
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const [soldOut, setSoldOut] = useState(false)

  if (!event) {
    return (
      <section data-testid="page-checkout">
        <h1>Checkout</h1>
        <p data-testid="no-event">No event selected.</p>
      </section>
    )
  }

  const effectiveTier = tierId || firstTier

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSoldOut(false)
    if (buyer.trim().length === 0) {
      setError('Name is required')
      return
    }
    setError('')
    const ok = buy({ eventId: event.id, tierId: effectiveTier, qty, buyer: buyer.trim() })
    if (!ok) {
      setSoldOut(true)
      return
    }
    setBuyer('')
    navigate('my-tickets')
  }

  return (
    <section data-testid="page-checkout">
      <h1>Checkout</h1>
      <form data-testid="checkout-form" onSubmit={onSubmit}>
        <label htmlFor="buyer">Buyer</label>
        <input
          id="buyer"
          data-testid="buyer-input"
          value={buyer}
          onChange={(e) => setBuyer(e.target.value)}
        />

        <label htmlFor="tier">Tier</label>
        <select
          id="tier"
          data-testid="tier-select"
          value={effectiveTier}
          onChange={(e) => setTierId(e.target.value)}
        >
          {event.tiers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <label htmlFor="qty">Quantity</label>
        <input
          id="qty"
          type="number"
          data-testid="qty-input"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}
        {soldOut ? <p data-testid="sold-out-error">Not enough tickets available.</p> : null}

        <button type="submit" data-testid="submit-buy">
          Buy tickets
        </button>
      </form>
    </section>
  )
}
