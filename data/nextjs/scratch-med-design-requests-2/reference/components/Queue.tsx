'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority, Status } from '../lib/types'

export function Queue() {
  const { requests, filter, addRequest, setInProgress, setDone, setFilter } = useApp()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

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
        <p>{`New: ${countOf('new')}`}</p>
        <p>{`In-progress: ${countOf('in-progress')}`}</p>
        <p>{`Done: ${countOf('done')}`}</p>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Status | 'all')}
        >
          <option value="all">all</option>
          <option value="new">new</option>
          <option value="in-progress">in-progress</option>
          <option value="done">done</option>
        </select>
      </div>
      <ul>
        {visible.map((req) => (
          <li key={req.id}>
            <span>{req.title}</span>
            <span>{req.priority}</span>
            <span>{req.status}</span>
            <button
              aria-label={`Set ${req.title} in-progress`}
              disabled={req.status === 'in-progress' || req.status === 'done'}
              onClick={() => setInProgress(req.id)}
            >
              Set in-progress
            </button>
            <button
              aria-label={`Set ${req.title} done`}
              disabled={req.status === 'done'}
              onClick={() => setDone(req.id)}
            >
              Set done
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
