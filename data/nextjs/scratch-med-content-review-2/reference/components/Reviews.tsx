'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { ReviewStatus } from '../lib/types'

const STATUSES: ReviewStatus[] = ['draft', 'approved', 'changes']

export function Reviews() {
  const { items, addItem, setStatus } = useApp()
  const [title, setTitle] = useState('')
  const [reviewer, setReviewer] = useState('')
  const [filter, setFilter] = useState<'all' | ReviewStatus>('all')

  const visible = filter === 'all' ? items : items.filter((i) => i.status === filter)

  return (
    <section aria-label="Reviews view">
      <h1>Reviews</h1>
      <input
        aria-label="Item title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        aria-label="Reviewer name"
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
      <label htmlFor="filter-select">Filter by status</label>
      <select
        id="filter-select"
        aria-label="Filter by status"
        value={filter}
        onChange={(e) => setFilter(e.target.value as 'all' | ReviewStatus)}
      >
        <option value="all">All</option>
        <option value="draft">Draft</option>
        <option value="approved">Approved</option>
        <option value="changes">Changes</option>
      </select>
      <h2>{`Items (${visible.length})`}</h2>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <span>{item.reviewer}</span>
            <span>{item.status}</span>
            {STATUSES.map((s) => (
              <button
                key={s}
                aria-label={`Set ${item.title} to ${s}`}
                disabled={item.status === s}
                onClick={() => setStatus(item.id, s)}
              >
                {s === 'draft' ? 'Draft' : s === 'approved' ? 'Approved' : 'Changes'}
              </button>
            ))}
          </li>
        ))}
      </ul>
    </section>
  )
}
