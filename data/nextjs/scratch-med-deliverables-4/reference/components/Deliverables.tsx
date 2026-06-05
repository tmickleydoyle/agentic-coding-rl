'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Deliverables() {
  const { items, filter, addItem, markDelivered, markPending, setFilter } = useApp()
  const [name, setName] = useState('')
  const [due, setDue] = useState('')

  const filtered = filter === 'pending' ? items.filter((i) => i.status === 'pending') : items
  const headingLabel = filter === 'pending' ? `Pending only (${filtered.length})` : `All (${filtered.length})`

  return (
    <section aria-label="Deliverables view">
      <h1>Deliverables</h1>
      <div>
        <input
          aria-label="Item"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Deliverable name"
        />
        <input
          aria-label="Due date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          placeholder="e.g. 2024-06-30"
        />
        <button
          onClick={() => {
            addItem(name, due)
            setName('')
            setDue('')
          }}
        >
          Add
        </button>
      </div>
      <div>
        <button
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
        >
          All
        </button>
        <button
          onClick={() => setFilter('pending')}
          aria-pressed={filter === 'pending'}
        >
          Pending only
        </button>
      </div>
      <h2>{headingLabel}</h2>
      <ul>
        {filtered.map((item) => (
          <li key={item.id}>
            <span>{item.name}</span>
            <span>{item.due}</span>
            <span>{item.status}</span>
            <button
              onClick={() => markDelivered(item.id)}
              disabled={item.status === 'delivered'}
            >
              Mark delivered
            </button>
            <button
              onClick={() => markPending(item.id)}
              disabled={item.status === 'pending'}
            >
              Mark pending
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
