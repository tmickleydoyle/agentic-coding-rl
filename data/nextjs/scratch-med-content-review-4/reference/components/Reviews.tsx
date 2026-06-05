'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { ItemStatus } from '../lib/types'

const FILTER_OPTIONS: Array<'All' | ItemStatus> = ['All', 'draft', 'approved', 'changes']

export function Reviews() {
  const { items, addItem, setStatus } = useApp()
  const [title, setTitle] = useState('')
  const [reviewer, setReviewer] = useState('')
  const [filter, setFilter] = useState<'All' | ItemStatus>('All')

  const filtered = filter === 'All' ? items : items.filter((i) => i.status === filter)

  return (
    <section aria-label="Reviews view">
      <h1>Reviews</h1>
      <div>
        <input
          aria-label="Item title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          aria-label="Reviewer"
          value={reviewer}
          onChange={(e) => setReviewer(e.target.value)}
        />
        <button
          onClick={() => {
            addItem(title, reviewer)
            setTitle('')
            setReviewer('')
          }}
        >
          Add item
        </button>
      </div>
      <div>
        <label htmlFor="filter-status">Filter by status</label>
        <select
          id="filter-status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'All' | ItemStatus)}
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <p>{`Showing: ${filtered.length} items`}</p>
      <ul>
        {filtered.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <span>{item.reviewer}</span>
            <span>{item.status}</span>
            <button onClick={() => setStatus(item.id, 'approved')}>Approve</button>
            <button onClick={() => setStatus(item.id, 'changes')}>Request changes</button>
            <button onClick={() => setStatus(item.id, 'draft')}>Reset to draft</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
