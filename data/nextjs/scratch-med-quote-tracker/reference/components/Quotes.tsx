'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { QuoteStatus } from '../lib/types'

const STATUS_OPTIONS: QuoteStatus[] = ['sent', 'won', 'lost']

export function Quotes() {
  const { quotes, filter, setFilter, addQuote, deleteQuote } = useApp()
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState<QuoteStatus>('sent')

  const visible = filter === 'all' ? quotes : quotes.filter((q) => q.status === filter)

  function handleAdd() {
    const amt = parseFloat(amount)
    addQuote(client, amt, status)
    setClient('')
    setAmount('')
    setStatus('sent')
  }

  return (
    <section aria-label="Quotes view">
      <h1>{`Quotes (${visible.length})`}</h1>
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
        <select
          aria-label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as QuoteStatus)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button onClick={handleAdd}>Add Quote</button>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as QuoteStatus | 'all')}
        >
          <option value="all">all</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <ul>
        {visible.map((q) => (
          <li key={q.id}>
            <span>{q.client}</span>
            <span>{`$${q.amount.toFixed(2)}`}</span>
            <span>{q.status}</span>
            <button aria-label={`Delete ${q.client}`} onClick={() => deleteQuote(q.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
