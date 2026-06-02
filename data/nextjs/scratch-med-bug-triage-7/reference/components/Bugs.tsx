'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Severity } from '../lib/types'

type FilterOption = 'All' | 'Open' | 'Closed'

export function Bugs() {
  const { bugs, addBug, closeBug, reopenBug } = useApp()
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState<Severity>('Low')
  const [filter, setFilter] = useState<FilterOption>('All')

  const filtered = bugs.filter((b) => {
    if (filter === 'Open') return b.status === 'open'
    if (filter === 'Closed') return b.status === 'closed'
    return true
  })

  return (
    <section aria-label="Bugs view">
      <h1>{`Bugs (${filtered.length})`}</h1>
      <div>
        <input
          aria-label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          aria-label="Severity"
          value={severity}
          onChange={(e) => setSeverity(e.target.value as Severity)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button
          onClick={() => {
            addBug(title, severity)
            setTitle('')
          }}
        >
          Add Bug
        </button>
      </div>
      <div>
        <label htmlFor="filter-status">Filter by status</label>
        <select
          id="filter-status"
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterOption)}
        >
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      <ul>
        {filtered.map((bug) => (
          <li key={bug.id}>
            <span>{bug.title}</span>
            <span>{bug.severity}</span>
            <span>{bug.status}</span>
            <button
              aria-label={`Close ${bug.title}`}
              disabled={bug.status === 'closed'}
              onClick={() => closeBug(bug.id)}
            >
              Close
            </button>
            <button
              aria-label={`Reopen ${bug.title}`}
              disabled={bug.status === 'open'}
              onClick={() => reopenBug(bug.id)}
            >
              Reopen
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
