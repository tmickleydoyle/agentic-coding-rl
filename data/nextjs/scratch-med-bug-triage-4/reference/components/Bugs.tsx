'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Severity } from '../lib/types'

type FilterStatus = 'all' | 'open' | 'closed'

export function Bugs() {
  const { bugs, addBug, closeBug } = useApp()
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState<Severity>('low')
  const [filter, setFilter] = useState<FilterStatus>('all')

  const visible = bugs.filter((b) => filter === 'all' || b.status === filter)

  return (
    <section aria-label="Bugs view">
      <h1>{`Bugs (${visible.length})`}</h1>
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
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
      </select>
      <button
        onClick={() => {
          addBug(title, severity)
          setTitle('')
        }}
      >
        Add Bug
      </button>
      <select
        aria-label="Filter by status"
        value={filter}
        onChange={(e) => setFilter(e.target.value as FilterStatus)}
      >
        <option value="all">all</option>
        <option value="open">open</option>
        <option value="closed">closed</option>
      </select>
      <ul>
        {visible.map((bug) => (
          <li key={bug.id}>
            <span>{bug.title}</span>
            <span>{bug.severity}</span>
            <span>{bug.status}</span>
            {bug.status === 'open' && (
              <button
                aria-label={`Close ${bug.title}`}
                onClick={() => closeBug(bug.id)}
              >
                Close
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
