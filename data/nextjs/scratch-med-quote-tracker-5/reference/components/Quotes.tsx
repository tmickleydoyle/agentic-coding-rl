'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { QuoteStatus } from '../lib/types'
import { fmt } from '../lib/fmt'

type FilterOption = 'all' | QuoteStatus

export function Quotes() {
  const { quotes, addQuote, markWon, markLost } = useApp()
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')
  const [filter, setFilter] = useState<FilterOption>('all')

  const visible = filter === 'all' ? quotes : quotes.filter((q) => q.status === filter)

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
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          onClick={() => {
            addQuote(client, amount)
            setClient('')
            setAmount('')
          }}
        >
          Add quote
        </button>
      </div>
      <div>
        <label htmlFor="filter-status">Filter by status</label>
        <select
          id="filter-status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterOption)}
        >
          <option value="all">All</option>
          <option value="sent">Sent</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>
      <p>{`Showing: ${visible.length}`}</p>
      <ul>
        {visible.map((q) => (
          <li key={q.id}>
            <span>{q.client}</span>
            <span>{fmt(q.amount)}</span>
            <span>{q.status}</span>
            <button
              aria-label={`Mark ${q.client} won`}
              disabled={q.status === 'won'}
              onClick={() => markWon(q.id)}
            >
              Mark won
            </button>
            <button
              aria-label={`Mark ${q.client} lost`}
              disabled={q.status === 'lost'}
              onClick={() => markLost(q.id)}
            >
              Mark lost
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
