'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority, Status } from '../lib/types'

const PRIORITIES: Priority[] = ['low', 'medium', 'high']
const STATUSES: Status[] = ['new', 'in-progress', 'done']
const FILTER_OPTIONS: ['all', ...Status[]] = ['all', 'new', 'in-progress', 'done']

export function Queue() {
  const { requests, addRequest, setStatus } = useApp()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [filter, setFilter] = useState<'all' | Status>('all')

  const countOf = (s: Status) => requests.filter((r) => r.status === s).length
  const visible = filter === 'all' ? requests : requests.filter((r) => r.status === filter)

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
          Add Request
        </button>
      </div>
      <div>
        <span>{`New: ${countOf('new')}`}</span>
        <span>{`In Progress: ${countOf('in-progress')}`}</span>
        <span>{`Done: ${countOf('done')}`}</span>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | Status)}
        >
          {FILTER_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
      <ul>
        {visible.map((req) => (
          <li key={req.id}>
            <span>{req.title}</span>
            <span>{req.priority}</span>
            <span>{req.status}</span>
            <select
              aria-label={`Status for ${req.title}`}
              value={req.status}
              onChange={(e) => setStatus(req.id, e.target.value as Status)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </section>
  )
}
