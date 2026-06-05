'use client'
import { useState } from 'react'
import { useAccounts } from '../../components/AccountsProvider'

export default function TransferPage() {
  const { accounts, transfer } = useAccounts()
  const [fromId, setFromId] = useState(accounts[0]?.id ?? '')
  const [toId, setToId] = useState(accounts[1]?.id ?? '')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Number(amount)
    const result = transfer({ fromId, toId, amount: parsed })
    if (!result.ok) {
      setError(result.error)
      setSuccess(false)
      return
    }
    setError('')
    setSuccess(true)
    setAmount('')
  }

  return (
    <section data-testid="page-transfer">
      <h1>Transfer</h1>
      <form data-testid="transfer-form" onSubmit={onSubmit}>
        <label htmlFor="from">From</label>
        <select
          id="from"
          data-testid="from-select"
          value={fromId}
          onChange={(e) => setFromId(e.target.value)}
        >
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <label htmlFor="to">To</label>
        <select
          id="to"
          data-testid="to-select"
          value={toId}
          onChange={(e) => setToId(e.target.value)}
        >
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          data-testid="amount-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {error ? <p data-testid="transfer-error">{error}</p> : null}
        {success ? <p data-testid="transfer-success">Transfer complete</p> : null}

        <button type="submit" data-testid="submit-transfer">
          Transfer
        </button>
      </form>
    </section>
  )
}
