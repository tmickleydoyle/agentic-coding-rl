'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Severity } from '../lib/types'

const SEVERITIES: Severity[] = ['low', 'medium', 'high', 'critical']

export function Bugs() {
  const { bugs, addBug, closeBug, reopenBug } = useApp()
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState<Severity>('low')
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all')

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
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
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
          onChange={(e) => setFilter(e.target.value as 'all' | 'open' | 'closed')}
        >
          <option value="all">all</option>
          <option value="open">open</option>
          <option value="closed">closed</option>
        </select>
      </div>
      <p>{`Showing: ${visible.length} bugs`}</p>
      <ul>
        {visible.map((bug) => (
          <li key={bug.id}>
            <span>{bug.title}</span>
            <span>{bug.severity}</span>
            <span>{bug.status}</span>
            {bug.status === 'open' ? (
              <button aria-label={`Close ${bug.title}`} onClick={() => closeBug(bug.id)}>
                Close
              </button>
            ) : (
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
