'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { fmt } from '../lib/fmt'

export function Invoices() {
  const { invoices, addInvoice, markPaid, showUnpaidOnly, toggleShowUnpaidOnly } = useApp()
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')

  const totalCount = invoices.length
  const visible = showUnpaidOnly ? invoices.filter((i) => i.status === 'unpaid') : invoices
  const outstanding = invoices.reduce((sum, i) => (i.status === 'unpaid' ? sum + i.amount : sum), 0)

  return (
    <section aria-label="Invoices view">
      <h1>{`Invoices (${totalCount})`}</h1>
      <div>
        <input
          aria-label="Client"
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />
        <input
          aria-label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          min="0"
        />
        <button
          onClick={() => {
            addInvoice(client, amount)
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
          onChange={toggleShowUnpaidOnly}
        />
        Show unpaid only
      </label>
      <ul>
        {visible.map((inv) => (
          <li key={inv.id}>
            <span>{inv.client}</span>
            <span>{fmt(inv.amount)}</span>
            <span>{inv.status}</span>
            <button
              aria-label={`Mark paid ${inv.client}`}
              disabled={inv.status === 'paid'}
              onClick={() => markPaid(inv.id)}
            >
              Mark paid
            </button>
          </li>
        ))}
      </ul>
      <p>{`Total outstanding: ${fmt(outstanding)}`}</p>
    </section>
  )
}
