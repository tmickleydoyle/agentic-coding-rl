'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

type Filter = 'all' | 'pending'

export function DeliverablesView() {
  const { items, addItem, markDelivered, deleteItem } = useApp()
  const [name, setName] = useState('')
  const [due, setDue] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const visible = filter === 'pending' ? items.filter((i) => i.status === 'pending') : items

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
            addItem(name, due)
            setName('')
            setDue('')
          }}
        >
          Add
        </button>
      </div>
      <div>
        <button onClick={() => setFilter('all')} aria-pressed={filter === 'all'}>All</button>
        <button onClick={() => setFilter('pending')} aria-pressed={filter === 'pending'}>Pending</button>
      </div>
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
              onClick={() => deleteItem(item.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p>{`Showing ${visible.length} of ${items.length}`}</p>
    </section>
  )
}
