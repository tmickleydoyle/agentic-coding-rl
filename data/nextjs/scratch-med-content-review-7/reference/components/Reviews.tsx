'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { ItemStatus } from '../lib/types'

type FilterOption = 'all' | ItemStatus

export function Reviews() {
  const { items, addItem, setStatus } = useApp()
  const [title, setTitle] = useState('')
  const [reviewer, setReviewer] = useState('')
  const [filter, setFilter] = useState<FilterOption>('all')

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
        <button onClick={() => setFilter('all')} aria-pressed={filter === 'all'}>All</button>
        <button onClick={() => setFilter('draft')} aria-pressed={filter === 'draft'}>Draft</button>
        <button onClick={() => setFilter('approved')} aria-pressed={filter === 'approved'}>Approved</button>
        <button onClick={() => setFilter('changes')} aria-pressed={filter === 'changes'}>Changes</button>
      </div>
      <p>{`Showing: ${visible.length} items`}</p>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <span>{item.reviewer}</span>
            <span>{item.status}</span>
            <button onClick={() => setStatus(item.id, 'draft')}>Set draft</button>
            <button onClick={() => setStatus(item.id, 'approved')}>Approve</button>
            <button onClick={() => setStatus(item.id, 'changes')}>Request changes</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
