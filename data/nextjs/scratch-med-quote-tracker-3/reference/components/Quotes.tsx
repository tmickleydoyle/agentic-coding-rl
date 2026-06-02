'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { formatAmount } from '../lib/format'
import type { QuoteStatus } from '../lib/types'

const STATUS_OPTIONS: QuoteStatus[] = ['sent', 'won', 'lost']
const FILTER_OPTIONS: Array<'all' | QuoteStatus> = ['all', 'sent', 'won', 'lost']

export function Quotes() {
  const { quotes, addQuote, deleteQuote } = useApp()
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState<QuoteStatus>('sent')
  const [filter, setFilter] = useState<'all' | QuoteStatus>('all')

  const filtered = filter === 'all' ? quotes : quotes.filter((q) => q.status === filter)
  const showingTotal = filtered.reduce((s, q) => s + q.amount, 0)

  function handleAdd() {
    const parsed = parseFloat(amount)
    addQuote(client, parsed, status)
    setClient('')
    setAmount('')
    setStatus('sent')
  }

  return (
    <section aria-label="Quotes view">
      <h1>Quotes</h1>
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
          onChange={(e) => setFilter(e.target.value as 'all' | QuoteStatus)}
        >
          {FILTER_OPTIONS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <p>{`Showing total: ${formatAmount(showingTotal)}`}</p>
      <ul>
        {filtered.map((q) => (
          <li key={q.id}>
            <span>{q.client}</span>
            <span>{formatAmount(q.amount)}</span>
            <span>{q.status}</span>
            <button aria-label={`Delete ${q.client}`} onClick={() => deleteQuote(q.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
