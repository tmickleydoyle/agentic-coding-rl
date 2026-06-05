'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Deliverables() {
  const { deliverables, addDeliverable, markDelivered } = useApp()
  const [item, setItem] = useState('')
  const [due, setDue] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending'>('all')

  const shown =
    filter === 'pending'
      ? deliverables.filter((d) => d.status === 'pending')
      : deliverables

  const heading =
    filter === 'pending'
      ? `Pending deliverables (${shown.length})`
      : `All deliverables (${shown.length})`

  return (
    <section aria-label="Deliverables view">
      <h1>Deliverables</h1>
      <div>
        <label htmlFor="item-input">Item</label>
        <input
          id="item-input"
          aria-label="Item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <label htmlFor="due-input">Due date</label>
        <input
          id="due-input"
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
        <button onClick={() => setFilter('all')}>Show All</button>
        <button onClick={() => setFilter('pending')}>Show Pending</button>
      </div>
      <h2>{heading}</h2>
      <ul>
        {shown.map((d) => (
          <li key={d.id}>
            <span>{d.item}</span>
            {d.due && <span>{d.due}</span>}
            <span>{d.status}</span>
            <button
              aria-label={`Mark delivered ${d.item}`}
              disabled={d.status === 'delivered'}
              onClick={() => markDelivered(d.id)}
            >
              Mark delivered
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
