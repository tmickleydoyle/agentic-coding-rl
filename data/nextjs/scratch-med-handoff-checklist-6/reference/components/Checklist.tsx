'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Filter } from '../lib/types'

export function Checklist() {
  const { items, filter, addItem, toggleItem, deleteItem, setFilter } = useApp()
  const [title, setTitle] = useState('')

  const remaining = items.filter((item) => !item.done).length

  const visible = items.filter((item) => {
    if (filter === 'done') return item.done
    if (filter === 'pending') return !item.done
    return true
  })

  const FILTERS: [Filter, string][] = [
    ['all', 'All'],
    ['done', 'Done'],
    ['pending', 'Pending'],
  ]

  return (
    <section aria-label="Checklist view">
      <h1>Checklist</h1>
      <h2>{`Remaining: ${remaining}`}</h2>
      <input
        aria-label="New item"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={() => {
          addItem(title)
          setTitle('')
        }}
      >
        Add item
      </button>
      <div aria-label="Filter options">
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
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <button
              aria-label={item.done ? `Mark undone ${item.title}` : `Mark done ${item.title}`}
              onClick={() => toggleItem(item.id)}
            >
              {item.done ? 'Mark undone' : 'Mark done'}
            </button>
            <button
              aria-label={`Delete ${item.title}`}
              onClick={() => deleteItem(item.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
