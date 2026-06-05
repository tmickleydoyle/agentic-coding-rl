'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority } from '../lib/types'

export function Queue() {
  const { requests, addRequest, setStatus, filter, setFilter } = useApp()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

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
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">all</option>
          <option value="new">new</option>
          <option value="in-progress">in-progress</option>
          <option value="done">done</option>
        </select>
        <span>{`Showing: ${visible.length}`}</span>
      </div>
      <ul>
        {visible.map((req) => (
          <li key={req.id}>
            <span>{req.title}</span>
            <span>{req.priority}</span>
            <span>{req.status}</span>
            <button
              aria-label={`Set in-progress ${req.title}`}
              disabled={req.status === 'in-progress'}
              onClick={() => setStatus(req.id, 'in-progress')}
            >
              Set in-progress
            </button>
            <button
              aria-label={`Set done ${req.title}`}
              disabled={req.status === 'done'}
              onClick={() => setStatus(req.id, 'done')}
            >
              Set done
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
