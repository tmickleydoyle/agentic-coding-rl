'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { formatAmount } from '../lib/format'

export function Invoices() {
  const { invoices, addInvoice, markPaid } = useApp()
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false)

  const outstanding = invoices
    .filter((inv) => !inv.paid)
    .reduce((sum, inv) => sum + inv.amount, 0)

  const visible = showUnpaidOnly ? invoices.filter((inv) => !inv.paid) : invoices

  function handleAdd() {
    const amt = parseFloat(amount)
    addInvoice(client, isNaN(amt) ? 0 : amt)
    setClient('')
    setAmount('')
  }

  return (
    <section aria-label="Invoices view">
      <h1>Invoices</h1>
      <div>
        <input
          aria-label="Client"
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />
        <input
          aria-label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleAdd}>Add Invoice</button>
      </div>
      <button onClick={() => setShowUnpaidOnly((s) => !s)}>
        {showUnpaidOnly ? 'Show: All' : 'Show: Unpaid'}
      </button>
      <ul>
        {visible.map((inv) => (
          <li key={inv.id}>
            <span>{inv.client}</span>
            <span>{formatAmount(inv.amount)}</span>
            <span>{inv.paid ? 'Paid' : 'Unpaid'}</span>
            <button
              aria-label={`Mark Paid ${inv.client}`}
              onClick={() => markPaid(inv.id)}
              disabled={inv.paid}
            >
              Mark Paid
            </button>
          </li>
        ))}
      </ul>
      <p>{`Outstanding: ${formatAmount(outstanding)}`}</p>
    </section>
  )
}
