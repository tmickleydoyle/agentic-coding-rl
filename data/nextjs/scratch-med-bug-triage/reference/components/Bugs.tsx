'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Severity } from '../lib/types'

export function Bugs() {
  const { bugs, filter, addBug, toggleBug, setFilter } = useApp()
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState<Severity>('low')

  const visible = bugs.filter((b) => filter === 'all' || b.status === filter)

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
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'open' | 'closed')}
        >
          <option value="all">all</option>
          <option value="open">open</option>
          <option value="closed">closed</option>
        </select>
      </div>
      <ul>
        {visible.map((bug) => (
          <li key={bug.id}>
            <span>{bug.title}</span>
            <span>{bug.severity}</span>
            <button onClick={() => toggleBug(bug.id)}>
              {bug.status === 'open' ? 'Close' : 'Reopen'}
            </button>
          </li>
        ))}
      </ul>
      <p>{`Showing: ${visible.length} bugs`}</p>
    </section>
  )
}
