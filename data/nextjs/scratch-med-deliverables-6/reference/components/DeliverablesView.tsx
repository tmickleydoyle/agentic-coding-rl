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
  const { items, filter, setFilter, addItem, markDelivered, markPending } = useApp()
  const [name, setName] = useState('')
  const [due, setDue] = useState('')

  const visible = items.filter((d) =>
    filter === 'all' ? true : d.status === filter
  )

  return (
    <section aria-label="Deliverables view">
      <h1>{`Deliverables (${visible.length})`}</h1>
      <div>
        <input
          aria-label="Item"
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
            addItem(name, due)
            setName('')
            setDue('')
          }}
        >
          Add
        </button>
      </div>
      <div role="group" aria-label="Filter deliverables">
        {FILTERS.map(([f, label]) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f ? 'true' : 'false'}
          >
            {label}
          </button>
        ))}
      </div>
      <ul>
        {visible.map((d) => (
          <li key={d.id}>
            <span>{d.name}</span>
            {d.due && <span>{d.due}</span>}
            <span>{d.status}</span>
            <button
              aria-label={`Mark delivered ${d.name}`}
              disabled={d.status === 'delivered'}
              onClick={() => markDelivered(d.id)}
            >
              Mark delivered
            </button>
            <button
              aria-label={`Mark pending ${d.name}`}
              disabled={d.status === 'pending'}
              onClick={() => markPending(d.id)}
            >
              Mark pending
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
