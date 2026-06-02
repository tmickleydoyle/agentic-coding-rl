'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { formatAmount } from '../lib/utils'

export function Invoices() {
  const { invoices, addInvoice, markPaid } = useApp()
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')
  const [filter, setFilter] = useState<'all' | 'unpaid'>('all')

  const displayed = filter === 'unpaid' ? invoices.filter((inv) => !inv.paid) : invoices
  const outstanding = invoices.reduce((sum, inv) => (inv.paid ? sum : sum + inv.amount), 0)

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
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
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
      <div>
        <label>
          <input
            type="radio"
            name="filter"
            value="all"
            checked={filter === 'all'}
            onChange={() => setFilter('all')}
          />
          All
        </label>
        <label>
          <input
            type="radio"
            name="filter"
            value="unpaid"
            checked={filter === 'unpaid'}
            onChange={() => setFilter('unpaid')}
          />
          Unpaid Only
        </label>
      </div>
      <ul>
        {displayed.map((inv) => (
          <li key={inv.id}>
            <span>{inv.client}</span>
            <span>{formatAmount(inv.amount)}</span>
            <span>{inv.paid ? 'Paid' : 'Unpaid'}</span>
            {!inv.paid && (
              <button aria-label={`Mark Paid ${inv.client}`} onClick={() => markPaid(inv.id)}>
                Mark Paid
              </button>
            )}
          </li>
        ))}
      </ul>
      <p>{`Outstanding: ${formatAmount(outstanding)}`}</p>
    </section>
  )
}
