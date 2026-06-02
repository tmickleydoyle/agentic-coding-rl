'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority, RequestStatus, StatusFilter } from '../lib/types'

export function Queue() {
  const { requests, filter, addRequest, setStatus, setFilter } = useApp()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter)

  return (
    <section aria-label="Queue view">
      <h1>{`Requests (${filtered.length})`}</h1>
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
            setPriority('medium')
          }}
        >
          Add request
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as StatusFilter)}
        >
          <option value="all">all</option>
          <option value="new">new</option>
          <option value="in-progress">in-progress</option>
          <option value="done">done</option>
        </select>
      </div>
      <ul>
        {filtered.map((req) => (
          <li key={req.id}>
            <span>{req.title}</span>
            <span>{req.priority}</span>
            <span>{req.status}</span>
            <select
              aria-label={`Status for ${req.title}`}
              value={req.status}
              onChange={(e) => setStatus(req.id, e.target.value as RequestStatus)}
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
