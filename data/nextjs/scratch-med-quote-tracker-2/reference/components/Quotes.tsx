'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { QuoteStatus } from '../lib/types'

const STATUSES: QuoteStatus[] = ['sent', 'won', 'lost']

function fmt(n: number) {
  return `$${n.toFixed(2)}`
}

export function Quotes() {
  const { quotes, addQuote, deleteQuote, updateStatus } = useApp()
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')
  const [newStatus, setNewStatus] = useState<QuoteStatus>('sent')
  const [filter, setFilter] = useState<QuoteStatus | 'all'>('all')

  const displayed = filter === 'all' ? quotes : quotes.filter((q) => q.status === filter)
  const showingTotal = displayed.reduce((s, q) => s + q.amount, 0)

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
          aria-label="New quote status"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as QuoteStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={() => {
            const a = parseFloat(amount)
            addQuote(client, a, newStatus)
            setClient('')
            setAmount('')
            setNewStatus('sent')
          }}
        >
          Add Quote
        </button>
      </div>
      <div>
        <label htmlFor="filter-select">Filter</label>
        <select
          id="filter-select"
          aria-label="Filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as QuoteStatus | 'all')}
        >
          <option value="all">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <p>{`Showing total: ${fmt(showingTotal)}`}</p>
      <ul>
        {displayed.map((q) => (
          <li key={q.id}>
            <span>{q.client}</span>
            <span>{fmt(q.amount)}</span>
            <select
              aria-label={`Status for ${q.client}`}
              value={q.status}
              onChange={(e) => updateStatus(q.id, e.target.value as QuoteStatus)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button aria-label={`Delete ${q.client}`} onClick={() => deleteQuote(q.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
