'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Filter } from '../lib/types'

const FILTERS: [Filter, string][] = [
  ['all', 'All'],
  ['pending', 'Pending'],
  ['delivered', 'Delivered'],
]

export function DeliverablesView() {
  const { deliverables, filter, addDeliverable, markDelivered, setFilter } = useApp()
  const [name, setName] = useState('')
  const [due, setDue] = useState('')

  const visible = deliverables.filter((d) => {
    if (filter === 'all') return true
    return d.status === filter
  })

  return (
    <section aria-label="Deliverables view">
      <h1>Deliverables</h1>
      <div>
        <input
          aria-label="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          aria-label="Due date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
        <button
          onClick={() => {
            addDeliverable(name, due)
            setName('')
            setDue('')
          }}
        >
          Add deliverable
        </button>
      </div>
      <div>
        {FILTERS.map(([f, label]) => (
          <button
            key={f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {label}
          </button>
        ))}
      </div>
      <p>{`Showing: ${visible.length} items`}</p>
      <ul>
        {visible.map((d) => (
          <li key={d.id}>
            <span>{d.name}</span>
            <span>{d.due}</span>
            <span>{d.status}</span>
            {d.status === 'pending' && (
              <button onClick={() => markDelivered(d.id)}>Mark delivered</button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
