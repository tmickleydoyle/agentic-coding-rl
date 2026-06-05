'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority, Status } from '../lib/types'

type Filter = 'All' | Status

export function Queue() {
  const { requests, addRequest, setStatus } = useApp()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('low')
  const [filter, setFilter] = useState<Filter>('All')

  const countOf = (s: Status) => requests.filter((r) => r.status === s).length
  const total = requests.length

  const visible = filter === 'All' ? requests : requests.filter((r) => r.status === filter)

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
            setPriority('low')
          }}
        >
          Add request
        </button>
      </div>
      <div>
        <button onClick={() => setFilter('All')}>{`All (${total})`}</button>
        <button onClick={() => setFilter('new')}>{`new (${countOf('new')})`}</button>
        <button onClick={() => setFilter('in-progress')}>{`in-progress (${countOf('in-progress')})`}</button>
        <button onClick={() => setFilter('done')}>{`done (${countOf('done')})`}</button>
      </div>
      <p>{`Showing: ${visible.length} requests`}</p>
      <ul>
        {visible.map((req) => (
          <li key={req.id}>
            <span>{req.title}</span>
            <span>{req.priority}</span>
            <span>{req.status}</span>
            <button
              aria-label={`Set ${req.title} in-progress`}
              disabled={req.status === 'in-progress'}
              onClick={() => setStatus(req.id, 'in-progress')}
            >
              Set in-progress
            </button>
            <button
              aria-label={`Set ${req.title} done`}
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
