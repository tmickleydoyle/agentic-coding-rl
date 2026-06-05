'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { ReviewStatus } from '../lib/types'

type Filter = 'all' | ReviewStatus

const FILTERS: [Filter, string][] = [
  ['all', 'All'],
  ['draft', 'Draft'],
  ['approved', 'Approved'],
  ['changes', 'Changes'],
]

export function Reviews() {
  const { items, addItem, setStatus } = useApp()
  const [title, setTitle] = useState('')
  const [reviewer, setReviewer] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const visible = filter === 'all' ? items : items.filter((i) => i.status === filter)

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
      </div>
      <div aria-label="Filter controls">
        {FILTERS.map(([f, label]) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
          >
            {label}
          </button>
        ))}
      </div>
      <h2>{`Showing ${visible.length} items`}</h2>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <span>{item.reviewer}</span>
            <span>{item.status}</span>
            <button onClick={() => setStatus(item.id, 'draft')}>Set Draft</button>
            <button onClick={() => setStatus(item.id, 'approved')}>Set Approved</button>
            <button onClick={() => setStatus(item.id, 'changes')}>Set Changes</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
