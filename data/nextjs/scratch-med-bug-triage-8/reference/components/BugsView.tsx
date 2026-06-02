'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Severity, StatusFilter } from '../lib/types'

export function BugsView() {
  const { bugs, addBug, closeBug, reopenBug, statusFilter, setStatusFilter } = useApp()
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState<Severity>('Low')

  const filtered = bugs.filter((b) => {
    if (statusFilter === 'Open') return b.status === 'open'
    if (statusFilter === 'Closed') return b.status === 'closed'
    return true
  })

  return (
    <section aria-label="Bugs view">
      <h1>Bugs</h1>
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
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      <h2>{`Bugs (${filtered.length})`}</h2>
      <ul>
        {filtered.map((bug) => (
          <li key={bug.id}>
            <span>{bug.title}</span>
            <span>{bug.severity}</span>
            <span>{bug.status}</span>
            {bug.status === 'open' && (
              <button aria-label={`Close ${bug.title}`} onClick={() => closeBug(bug.id)}>
                Close
              </button>
            )}
            {bug.status === 'closed' && (
              <button aria-label={`Reopen ${bug.title}`} onClick={() => reopenBug(bug.id)}>
                Reopen
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
