'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { ReviewStatus } from '../lib/types'

type Filter = 'All' | ReviewStatus

const FILTERS: Filter[] = ['All', 'draft', 'approved', 'changes']

export function Reviews() {
  const { items, addItem, advanceStatus } = useApp()
  const [title, setTitle] = useState('')
  const [reviewer, setReviewer] = useState('')
  const [filter, setFilter] = useState<Filter>('All')

  const visible = filter === 'All' ? items : items.filter((i) => i.status === filter)

  return (
    <section aria-label="Reviews view">
      <h1>{`Reviews (${visible.length})`}</h1>
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
      <div aria-label="Filter controls">
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
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <span>{item.reviewer}</span>
            <span>{`Status: ${item.status}`}</span>
            <button
              aria-label={`Next status for ${item.title}`}
              onClick={() => advanceStatus(item.id)}
            >
              Next status
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
