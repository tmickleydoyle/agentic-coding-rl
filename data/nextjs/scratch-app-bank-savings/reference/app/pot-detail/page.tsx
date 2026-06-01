'use client'
import { useState } from 'react'
import { useSavings } from '../../components/SavingsProvider'
import { potMet, potProgress } from '../../hooks/useSavings'

export default function PotDetailPage() {
  const { pots, unallocated, selectedId, allocate, withdraw } = useSavings()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const pot = pots.find((p) => p.id === selectedId)

  if (!pot) {
    return (
      <section data-testid="page-pot-detail">
        <p data-testid="no-selection">No pot selected.</p>
      </section>
    )
  }

  const run = (kind: 'allocate' | 'withdraw') => {
    const parsed = Number(amount)
    const fn = kind === 'allocate' ? allocate : withdraw
    const result = fn({ potId: pot.id, amount: parsed })
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
    <section data-testid="page-pot-detail">
      <h1 data-testid="pot-name">{pot.name}</h1>
      <p data-testid="pot-balance">{pot.balance}</p>
      <p data-testid="pot-goal">{pot.goal}</p>
      <p data-testid="pot-progress">{potProgress(pot)}</p>
      <p data-testid="goal-state">{potMet(pot) ? 'met' : 'saving'}</p>
      <p data-testid="pool">{unallocated}</p>

      <input
        data-testid="amount-input"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button data-testid="allocate-button" onClick={() => run('allocate')}>
        Allocate
      </button>
      <button data-testid="withdraw-button" onClick={() => run('withdraw')}>
        Withdraw
      </button>

      {error ? <p data-testid="action-error">{error}</p> : null}
      {success ? <p data-testid="action-success">Done</p> : null}
    </section>
  )
}
