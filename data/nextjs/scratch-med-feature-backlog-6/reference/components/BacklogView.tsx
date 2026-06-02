'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority, Status } from '../lib/types'

const PRIORITIES: Priority[] = ['P0', 'P1', 'P2']
const STATUSES: Status[] = ['idea', 'building', 'shipped']

export function BacklogView() {
  const { features, addFeature, deleteFeature, updateStatus } = useApp()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('P1')
  const [status, setStatus] = useState<Status>('idea')
  const [filter, setFilter] = useState<Priority | 'All'>('All')

  const visible = filter === 'All' ? features : features.filter((f) => f.priority === filter)

  return (
    <section aria-label="Backlog view">
      <h1>Backlog</h1>
      <div>
        <input
          aria-label="Feature title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          aria-label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          aria-label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={() => {
            addFeature(title, priority, status)
            setTitle('')
          }}
        >
          Add feature
        </button>
      </div>
      <div>
        {(['All', 'P0', 'P1', 'P2'] as const).map((p) => (
          <button key={p} onClick={() => setFilter(p)} aria-pressed={filter === p}>
            {p}
          </button>
        ))}
      </div>
      <p>{`Showing: ${visible.length} features`}</p>
      <ul>
        {visible.map((f) => (
          <li key={f.id}>
            <span>{f.title}</span>
            <span>{f.priority}</span>
            <span>{f.status}</span>
            <select
              aria-label={`Status for ${f.title}`}
              value={f.status}
              onChange={(e) => updateStatus(f.id, e.target.value as Status)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button aria-label={`Delete ${f.title}`} onClick={() => deleteFeature(f.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
