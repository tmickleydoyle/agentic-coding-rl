'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority, Status } from '../lib/types'

export function BacklogView() {
  const { features, addFeature, deleteFeature, updatePriority, updateStatus, filterPriority, setFilterPriority } = useApp()
  const [title, setTitle] = useState('')

  const visible = filterPriority === 'All' ? features : features.filter((f) => f.priority === filterPriority)

  return (
    <section aria-label="Backlog view">
      <h1>{`Features (${visible.length})`}</h1>
      <input
        aria-label="Feature title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={() => {
          addFeature(title)
          setTitle('')
        }}
      >
        Add feature
      </button>
      <label>
        Filter by priority
        <select
          aria-label="Filter by priority"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as Priority | 'All')}
        >
          <option value="All">All</option>
          <option value="P0">P0</option>
          <option value="P1">P1</option>
          <option value="P2">P2</option>
        </select>
      </label>
      <ul>
        {visible.map((f) => (
          <li key={f.id}>
            <span>{f.title}</span>
            <label>
              Priority
              <select
                aria-label={`Priority for ${f.title}`}
                value={f.priority}
                onChange={(e) => updatePriority(f.id, e.target.value as Priority)}
              >
                <option value="P0">P0</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
              </select>
            </label>
            <label>
              Status
              <select
                aria-label={`Status for ${f.title}`}
                value={f.status}
                onChange={(e) => updateStatus(f.id, e.target.value as Status)}
              >
                <option value="idea">idea</option>
                <option value="building">building</option>
                <option value="shipped">shipped</option>
              </select>
            </label>
            <button aria-label={`Delete ${f.title}`} onClick={() => deleteFeature(f.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
