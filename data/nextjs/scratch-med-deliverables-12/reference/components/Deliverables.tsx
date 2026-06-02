'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Deliverables() {
  const { items, addItem, markDelivered, deleteItem, filterPending, toggleFilter } = useApp()
  const [name, setName] = useState('')
  const [due, setDue] = useState('')

  const visible = filterPending ? items.filter((d) => d.status === 'pending') : items

  return (
    <section aria-label="Deliverables view">
      <h1>{`Deliverables (${visible.length})`}</h1>
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
            addItem(name, due)
            setName('')
            setDue('')
          }}
        >
          Add item
        </button>
      </div>
      <button onClick={toggleFilter}>
        {filterPending ? 'Show: Pending' : 'Show: All'}
      </button>
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
              aria-label={`Delete ${d.name}`}
              onClick={() => deleteItem(d.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
