'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Severity } from '../lib/types'

type Filter = 'All' | 'Open' | 'Closed'

export function Bugs() {
  const { bugs, filter, setFilter, addBug, toggleBug } = useApp()
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState<Severity>('low')

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
        {(['All', 'Open', 'Closed'] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}>
            {f}
          </button>
        ))}
      </div>
      <p>{`Showing: ${visible.length} bugs`}</p>
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
    </section>
  )
}
