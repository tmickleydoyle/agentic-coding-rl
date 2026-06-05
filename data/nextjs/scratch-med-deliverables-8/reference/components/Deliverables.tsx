'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { FilterType } from '../lib/types'

export function Deliverables() {
  const { deliverables, addDeliverable, markDelivered, deleteDeliverable } = useApp()
  const [name, setName] = useState('')
  const [due, setDue] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  const total = deliverables.length
  const visible = deliverables.filter((item) => {
    if (filter === 'pending') return item.status === 'pending'
    if (filter === 'delivered') return item.status === 'delivered'
    return true
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
        <button onClick={() => setFilter('all')} aria-pressed={filter === 'all'}>All</button>
        <button onClick={() => setFilter('pending')} aria-pressed={filter === 'pending'}>Pending</button>
        <button onClick={() => setFilter('delivered')} aria-pressed={filter === 'delivered'}>Delivered</button>
      </div>
      <p>{`Showing: ${visible.length} of ${total}`}</p>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.name}</span>
            <span>{item.due}</span>
            <span>{item.status}</span>
            <button
              aria-label={`Mark delivered ${item.name}`}
              disabled={item.status === 'delivered'}
              onClick={() => markDelivered(item.id)}
            >
              Mark delivered
            </button>
            <button
              aria-label={`Delete ${item.name}`}
              onClick={() => deleteDeliverable(item.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
