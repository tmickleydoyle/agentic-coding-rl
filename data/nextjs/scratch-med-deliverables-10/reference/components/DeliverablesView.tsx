'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function DeliverablesView() {
  const { deliverables, filter, addDeliverable, markDelivered, markPending, setFilter } = useApp()
  const [item, setItem] = useState('')
  const [due, setDue] = useState('')

  const visible =
    filter === 'pending' ? deliverables.filter((d) => d.status === 'pending') : deliverables

  return (
    <section aria-label="Deliverables view">
      <h1>Deliverables</h1>
      <div>
        <input
          aria-label="Item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <input
          aria-label="Due date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
        <button
          onClick={() => {
            addDeliverable(item, due)
            setItem('')
            setDue('')
          }}
        >
          Add
        </button>
      </div>
      <div>
        <button
          aria-pressed={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          Show: All
        </button>
        <button
          aria-pressed={filter === 'pending'}
          onClick={() => setFilter('pending')}
        >
          Show: Pending
        </button>
      </div>
      <ul>
        {visible.map((d) => (
          <li key={d.id}>
            <span>{d.item}</span>
            <span>{d.due}</span>
            <span>{d.status}</span>
            {d.status === 'pending' ? (
              <button onClick={() => markDelivered(d.id)}>Mark delivered</button>
            ) : (
              <button onClick={() => markPending(d.id)}>Mark pending</button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
