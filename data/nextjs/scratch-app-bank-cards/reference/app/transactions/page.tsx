'use client'
import { useState } from 'react'
import { useCards } from '../../components/CardsProvider'

export default function TransactionsPage() {
  const { cards, addCharge } = useCards()
  const [cardId, setCardId] = useState(cards[0]?.id ?? '')
  const [merchant, setMerchant] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Number(amount)
    const result = addCharge({ cardId, merchant: merchant.trim(), amount: parsed })
    if (!result.ok) {
      setError(result.error)
      setSuccess(false)
      return
    }
    setError('')
    setSuccess(true)
    setAmount('')
    setMerchant('')
  }

  return (
    <section data-testid="page-transactions">
      <h1>New charge</h1>
      <form data-testid="charge-form" onSubmit={onSubmit}>
        <label htmlFor="card">Card</label>
        <select
          id="card"
          data-testid="card-select"
          value={cardId}
          onChange={(e) => setCardId(e.target.value)}
        >
          {cards.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        <label htmlFor="merchant">Merchant</label>
        <input
          id="merchant"
          data-testid="merchant-input"
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
        />

        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          data-testid="amount-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {error ? <p data-testid="charge-error">{error}</p> : null}
        {success ? <p data-testid="charge-success">Charge added</p> : null}

        <button type="submit" data-testid="submit-charge">
          Add charge
        </button>
      </form>
    </section>
  )
}
