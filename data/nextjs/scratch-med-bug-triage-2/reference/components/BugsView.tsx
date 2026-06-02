'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Severity, FilterStatus } from '../lib/types'

const FILTERS: [FilterStatus, string][] = [
  ['all', 'All'],
  ['open', 'Open'],
  ['closed', 'Closed'],
]

export function BugsView() {
  const { bugs, filter, addBug, closeBug, setFilter } = useApp()
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState<Severity>('low')

  const visible = bugs.filter((b) => {
    if (filter === 'all') return true
    return b.status === filter
  })

  return (
    <section aria-label="Bugs view">
      <h1>Bug Triage</h1>
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
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <button
          onClick={() => {
            addBug(title, severity)
            setTitle('')
            setSeverity('low')
          }}
        >
          Add Bug
        </button>
      </div>
      <div>
        {FILTERS.map(([f, label]) => (
          <button
            key={f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {label}
          </button>
        ))}
      </div>
      <h2>{`Bugs (${visible.length})`}</h2>
      <ul>
        {visible.map((bug) => (
          <li key={bug.id}>
            <span>{bug.title}</span>
            <span>{bug.severity}</span>
            <span>{bug.status === 'open' ? 'Open' : 'Closed'}</span>
            <button
              aria-label={`Close Bug ${bug.title}`}
              disabled={bug.status === 'closed'}
              onClick={() => closeBug(bug.id)}
            >
              Close Bug
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
