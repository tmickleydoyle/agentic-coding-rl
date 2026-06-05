'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { formatAmount } from '../lib/utils'

export function Invoices() {
  const { invoices, addInvoice, markPaid } = useApp()
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false)

  const displayed = showUnpaidOnly ? invoices.filter((inv) => inv.status === 'unpaid') : invoices
  const outstanding = invoices
    .filter((inv) => inv.status === 'unpaid')
    .reduce((sum, inv) => sum + inv.amount, 0)

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
        <button
          onClick={() => {
            const parsed = parseFloat(amount)
            addInvoice(client, parsed)
            setClient('')
            setAmount('')
          }}
        >
          Add Invoice
        </button>
      </div>
      <label>
        <input
          type="checkbox"
          aria-label="Show unpaid only"
          checked={showUnpaidOnly}
          onChange={() => setShowUnpaidOnly((v) => !v)}
        />
        Show unpaid only
      </label>
      <ul>
        {displayed.map((inv) => (
          <li key={inv.id}>
            <span>{inv.client}</span>
            <span>{formatAmount(inv.amount)}</span>
            <span>{inv.status}</span>
            <button
              aria-label={`Mark Paid ${inv.client}`}
              disabled={inv.status === 'paid'}
              onClick={() => markPaid(inv.id)}
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
