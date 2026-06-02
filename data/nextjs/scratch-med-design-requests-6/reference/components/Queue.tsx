'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority, Status } from '../lib/types'

const PRIORITIES: Priority[] = ['low', 'medium', 'high']
const STATUSES: (Status | 'all')[] = ['all', 'new', 'in-progress', 'done']

export function Queue() {
  const { requests, filter, addRequest, setStatus, setFilter } = useApp()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  const displayed = filter === 'all' ? requests : requests.filter((r) => r.status === filter)

  return (
    <section aria-label="Queue view">
      <h1>Queue</h1>
      <div>
        <input
          aria-label="Title"
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
        <button
          onClick={() => {
            addRequest(title, priority)
            setTitle('')
          }}
        >
          Add request
        </button>
      </div>
      <div aria-label="Filter by status">
        <span>Filter by status</span>
        {STATUSES.map((s) => (
          <button
            key={s}
            aria-pressed={filter === s}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>
      <h2>{`Requests (${displayed.length})`}</h2>
      <ul>
        {displayed.map((r) => (
          <li key={r.id}>
            <span>{r.title}</span>
            <span>{r.priority}</span>
            <span>{r.status}</span>
            <select
              aria-label={`Status for ${r.title}`}
              value={r.status}
              onChange={(e) => setStatus(r.id, e.target.value as Status)}
            >
              <option value="new">new</option>
              <option value="in-progress">in-progress</option>
              <option value="done">done</option>
            </select>
          </li>
        ))}
      </ul>
    </section>
  )
}
