'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function DeliverablesList() {
  const { deliverables, addDeliverable, markDelivered, removeDeliverable } = useApp()
  const [name, setName] = useState('')
  const [due, setDue] = useState('')
  const [showPendingOnly, setShowPendingOnly] = useState(false)

  const visible = showPendingOnly
    ? deliverables.filter((d) => d.status === 'pending')
    : deliverables

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
            addDeliverable(name, due)
            setName('')
            setDue('')
          }}
        >
          Add item
        </button>
      </div>
      <button onClick={() => setShowPendingOnly((s) => !s)}>
        {showPendingOnly ? 'Show: pending' : 'Show: all'}
      </button>
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
              aria-label={`Remove ${item.name}`}
              onClick={() => removeDeliverable(item.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
