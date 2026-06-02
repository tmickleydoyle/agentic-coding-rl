'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { fmt } from '../lib/fmt'

export function Invoices() {
  const { invoices, filter, setFilter, addInvoice, markPaid } = useApp()
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')

  const visible = invoices.filter((inv) => {
    if (filter === 'unpaid') return !inv.paid
    if (filter === 'paid') return inv.paid
    return true
  })

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
            addInvoice(client, parseFloat(amount))
            setClient('')
            setAmount('')
          }}
        >
          Add Invoice
        </button>
      </div>
      <div>
        <button onClick={() => setFilter('all')} aria-pressed={filter === 'all'}>All</button>
        <button onClick={() => setFilter('unpaid')} aria-pressed={filter === 'unpaid'}>Unpaid</button>
        <button onClick={() => setFilter('paid')} aria-pressed={filter === 'paid'}>Paid</button>
      </div>
      <p>{`Showing: ${visible.length}`}</p>
      <ul>
        {visible.map((inv) => (
          <li key={inv.id}>
            <span>{inv.client}</span>
            <span>{fmt(inv.amount)}</span>
            <span>{inv.paid ? 'Paid' : 'Unpaid'}</span>
            {!inv.paid && (
              <button aria-label={`Mark Paid ${inv.client}`} onClick={() => markPaid(inv.id)}>
                Mark Paid
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
