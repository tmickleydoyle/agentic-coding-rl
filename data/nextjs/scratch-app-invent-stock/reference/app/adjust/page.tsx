'use client'
import { useState } from 'react'
import { useStock } from '../../components/AppStateProvider'
import { useProducts } from '../../hooks/useProducts'

export default function AdjustPage() {
  const { adjust, setReorderPoint } = useStock()
  const { selected } = useProducts()
  const [amount, setAmount] = useState('1')

  if (!selected) {
    return (
      <section data-testid="page-adjust">
        <h1>Adjust</h1>
        <p data-testid="no-selection">No product selected.</p>
      </section>
    )
  }

  const n = Number(amount)
  const step = Number.isFinite(n) ? Math.trunc(n) : 0

  return (
    <section data-testid="page-adjust">
      <h1>Adjust</h1>
      <span data-testid="adjust-name">{selected.name}</span>
      <span data-testid="adjust-qty">{selected.qty}</span>
      <span data-testid="adjust-reorder">{selected.reorderPoint}</span>
      <input
        data-testid="amount-input"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button data-testid="receive" onClick={() => adjust(selected.id, Math.abs(step))}>
        Receive
      </button>
      <button data-testid="ship" onClick={() => adjust(selected.id, -Math.abs(step))}>
        Ship
      </button>
      <button
        data-testid="raise-reorder"
        onClick={() => setReorderPoint(selected.id, selected.reorderPoint + 1)}
      >
        Raise reorder point
      </button>
    </section>
  )
}
