'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function DeliverablesView() {
  const { deliverables, filter, addDeliverable, markDelivered, deleteDeliverable, setFilter } = useApp()
  const [name, setName] = useState('')
  const [due, setDue] = useState('')

  const total = deliverables.length
  const deliveredCount = deliverables.filter((d) => d.status === 'delivered').length

  const visible = filter === 'pending'
    ? deliverables.filter((d) => d.status === 'pending')
    : deliverables

  return (
    <section aria-label="Deliverables view">
      <h1>Deliverables</h1>
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
            addDeliverable(name, due)
            setName('')
            setDue('')
          }}
        >
          Add deliverable
        </button>
      </div>
      <div>
        <button onClick={() => setFilter('all')}>Show all</button>
        <button onClick={() => setFilter('pending')}>Show pending</button>
      </div>
      <ul>
        {visible.map((d) => (
          <li key={d.id}>
            <span>{d.name}</span>
            <span>{d.due}</span>
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
              onClick={() => deleteDeliverable(d.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p>{`Delivered: ${deliveredCount} of ${total}`}</p>
    </section>
  )
}
