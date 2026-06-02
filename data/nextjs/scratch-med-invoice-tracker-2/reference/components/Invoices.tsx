'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { fmt } from '../lib/fmt'

export function Invoices() {
  const { invoices, addInvoice, markPaid, showUnpaidOnly, toggleShowUnpaidOnly } = useApp()
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')

  const total = invoices.length
  const visible = showUnpaidOnly ? invoices.filter((inv) => !inv.paid) : invoices

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
          onChange={toggleShowUnpaidOnly}
        />
        Show unpaid only
      </label>
      <p>{`Showing ${visible.length} of ${total} invoices`}</p>
      <ul>
        {visible.map((inv) => (
          <li key={inv.id}>
            <span>{inv.client}</span>
            <span>{fmt(inv.amount)}</span>
            <span>{inv.paid ? 'Paid' : 'Unpaid'}</span>
            {!inv.paid && (
              <button onClick={() => markPaid(inv.id)}>Mark Paid</button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
