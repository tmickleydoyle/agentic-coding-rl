'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority, Status } from '../lib/types'

export function BacklogView() {
  const {
    features,
    filterPriority,
    filterStatus,
    setFilterPriority,
    setFilterStatus,
    addFeature,
    deleteFeature,
    updatePriority,
    updateStatus,
  } = useApp()

  const [title, setTitle] = useState('')

  const visible = features.filter((f) => {
    const pMatch = filterPriority === 'All' || f.priority === filterPriority
    const sMatch = filterStatus === 'All' || f.status === filterStatus
    return pMatch && sMatch
  })

  return (
    <section aria-label="Backlog view">
      <h1>Backlog</h1>
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

      <div>
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
        <label>
          Filter by status
          <select
            aria-label="Filter by status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Status | 'All')}
          >
            <option value="All">All</option>
            <option value="idea">idea</option>
            <option value="building">building</option>
            <option value="shipped">shipped</option>
          </select>
        </label>
      </div>

      <p>{`Showing: ${visible.length} of ${features.length}`}</p>

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
