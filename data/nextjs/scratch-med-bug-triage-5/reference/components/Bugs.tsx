'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Severity } from '../lib/types'

type FilterOption = 'All' | 'Open' | 'Closed'

export function Bugs() {
  const { bugs, addBug, toggleBugStatus } = useApp()
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState<Severity>('Low')
  const [filter, setFilter] = useState<FilterOption>('All')

  const visible = bugs.filter((b) => {
    if (filter === 'Open') return b.status === 'open'
    if (filter === 'Closed') return b.status === 'closed'
    return true
  })

  return (
    <section aria-label="Bugs view">
      <h1>Bugs</h1>
      <div>
        <input
          aria-label="Bug title"
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
          Add bug
        </button>
      </div>
      <div>
        <select
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
        {visible.map((b) => (
          <li key={b.id}>
            <span>{b.title}</span>
            <span>{b.severity}</span>
            <span>{b.status}</span>
            <button onClick={() => toggleBugStatus(b.id)}>
              {b.status === 'open' ? 'Close' : 'Reopen'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
