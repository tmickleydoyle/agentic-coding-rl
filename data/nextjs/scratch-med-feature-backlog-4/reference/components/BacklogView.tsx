'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Priority } from '../lib/types'

const PRIORITIES: Priority[] = ['P0', 'P1', 'P2']

export function BacklogView() {
  const { features, addFeature, advanceFeature, deleteFeature } = useApp()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('P0')
  const [filter, setFilter] = useState<'All' | Priority>('All')

  const visible = filter === 'All' ? features : features.filter((f) => f.priority === filter)

  return (
    <section aria-label="Backlog view">
      <h1>Backlog</h1>
      <div>
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
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button
          onClick={() => {
            addFeature(title, priority)
            setTitle('')
          }}
        >
          Add feature
        </button>
      </div>
      <div>
        <label>
          Filter by priority
          <select
            aria-label="Filter by priority"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'All' | Priority)}
          >
            <option value="All">All</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
      </div>
      <p>{`Showing ${visible.length} of ${features.length} features`}</p>
      <ul>
        {visible.map((feat) => (
          <li key={feat.id}>
            <span>{feat.title}</span>
            <span>{feat.priority}</span>
            <span>{feat.status}</span>
            <button
              aria-label={`Advance ${feat.title}`}
              disabled={feat.status === 'shipped'}
              onClick={() => advanceFeature(feat.id)}
            >
              Advance
            </button>
            <button
              aria-label={`Delete ${feat.title}`}
              onClick={() => deleteFeature(feat.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
