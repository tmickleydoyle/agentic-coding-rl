'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Deliverables() {
  const { items, filter, addItem, markDelivered, markPending, setFilter } = useApp()
  const [name, setName] = useState('')
  const [due, setDue] = useState('')

  const visible = filter === 'pending' ? items.filter((it) => it.status === 'pending') : items

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
          Add deliverable
        </button>
      </div>
      <div>
        <button onClick={() => setFilter('all')} aria-pressed={filter === 'all'}>
          Show all
        </button>
        <button onClick={() => setFilter('pending')} aria-pressed={filter === 'pending'}>
          Show pending
        </button>
      </div>
      <ul>
        {visible.map((it) => (
          <li key={it.id}>
            <span>{it.name}</span>
            <span>{it.due}</span>
            <span>{it.status}</span>
            <button
              aria-label={`Mark ${it.name} delivered`}
              disabled={it.status === 'delivered'}
              onClick={() => markDelivered(it.id)}
            >
              Mark delivered
            </button>
            <button
              aria-label={`Mark ${it.name} pending`}
              disabled={it.status === 'pending'}
              onClick={() => markPending(it.id)}
            >
              Mark pending
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
