'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Filter } from '../lib/types'

const FILTERS: Filter[] = ['All', 'Paid', 'Unpaid']

function fmt(n: number) {
  return `$${n.toFixed(2)}`
}

export function Invoices() {
  const { invoices, addInvoice, markPaid, filter, setFilter } = useApp()
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')

  function handleAdd() {
    const a = parseFloat(amount)
    addInvoice(client, a)
    setClient('')
    setAmount('')
  }

  const visible = invoices.filter((inv) => {
    if (filter === 'Paid') return inv.paid
    if (filter === 'Unpaid') return !inv.paid
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
        <button onClick={handleAdd}>Add Invoice</button>
      </div>
      <div>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
          >
            {f}
          </button>
        ))}
      </div>
      <p>{`Showing: ${visible.length}`}</p>
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
