'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority, Status } from '../lib/types'

const FILTER_OPTIONS: (Status | 'all')[] = ['all', 'new', 'in-progress', 'done']

export function Queue() {
  const { requests, addRequest, setStatus } = useApp()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [filter, setFilter] = useState<Status | 'all'>('all')

  const displayed = filter === 'all' ? requests : requests.filter((r) => r.status === filter)

  return (
    <section aria-label="Queue view">
      <h1>{`Requests (${displayed.length})`}</h1>
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
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
      </select>
      <button
        onClick={() => {
          addRequest(title, priority)
          setTitle('')
        }}
      >
        Add request
      </button>
      <select
        aria-label="Filter by status"
        value={filter}
        onChange={(e) => setFilter(e.target.value as Status | 'all')}
      >
        {FILTER_OPTIONS.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ul>
        {displayed.map((req) => (
          <li key={req.id}>
            <span>{req.title}</span>
            <span>{req.priority}</span>
            <span>{req.status}</span>
            <button onClick={() => setStatus(req.id, 'new')}>Set new</button>
            <button onClick={() => setStatus(req.id, 'in-progress')}>Set in-progress</button>
            <button onClick={() => setStatus(req.id, 'done')}>Set done</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
