'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority, Status } from '../lib/types'

export function BacklogView() {
  const { features, addFeature, deleteFeature } = useApp()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('P1')
  const [status, setStatus] = useState<Status>('idea')
  const [filter, setFilter] = useState<'All' | Priority>('All')

  const visible = filter === 'All' ? features : features.filter((f) => f.priority === filter)

  return (
    <section aria-label="Backlog view">
      <h1>Backlog</h1>
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
        <option value="P0">P0</option>
        <option value="P1">P1</option>
        <option value="P2">P2</option>
      </select>
      <select
        aria-label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value as Status)}
      >
        <option value="idea">idea</option>
        <option value="building">building</option>
        <option value="shipped">shipped</option>
      </select>
      <button
        onClick={() => {
          addFeature(title, priority, status)
          setTitle('')
        }}
      >
        Add feature
      </button>
      <div>
        <select
          aria-label="Filter by priority"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'All' | Priority)}
        >
          <option value="All">All</option>
          <option value="P0">P0</option>
          <option value="P1">P1</option>
          <option value="P2">P2</option>
        </select>
      </div>
      <h2>{`Features (${visible.length})`}</h2>
      <ul>
        {visible.map((f) => (
          <li key={f.id}>
            <span>{f.title}</span>
            <span>{f.priority}</span>
            <span>{f.status}</span>
            <button aria-label={`Delete ${f.title}`} onClick={() => deleteFeature(f.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
