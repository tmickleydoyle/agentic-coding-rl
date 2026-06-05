'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Quarter } from '../lib/types'

const QUARTERS: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4']

export function Roadmap() {
  const { items, addItem, markInProgress, markShipped, deleteItem } = useApp()
  const [title, setTitle] = useState('')
  const [quarter, setQuarter] = useState<Quarter>('Q1')
  const [filter, setFilter] = useState<'All' | Quarter>('All')

  const visible = filter === 'All' ? items : items.filter((i) => i.quarter === filter)

  return (
    <section aria-label="Roadmap view">
      <h1>{`Roadmap Items (${visible.length})`}</h1>
      <input
        aria-label="Item title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        aria-label="Quarter"
        value={quarter}
        onChange={(e) => setQuarter(e.target.value as Quarter)}
      >
        {QUARTERS.map((q) => (
          <option key={q} value={q}>{q}</option>
        ))}
      </select>
      <button
        onClick={() => {
          addItem(title, quarter)
          setTitle('')
        }}
      >
        Add item
      </button>
      <select
        aria-label="Filter by quarter"
        value={filter}
        onChange={(e) => setFilter(e.target.value as 'All' | Quarter)}
      >
        <option value="All">All</option>
        {QUARTERS.map((q) => (
          <option key={q} value={q}>{q}</option>
        ))}
      </select>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <span>{item.quarter}</span>
            <span>{item.status}</span>
            <button
              aria-label={`Mark ${item.title} in-progress`}
              disabled={item.status === 'in-progress' || item.status === 'shipped'}
              onClick={() => markInProgress(item.id)}
            >
              Mark in-progress
            </button>
            <button
              aria-label={`Mark ${item.title} shipped`}
              disabled={item.status === 'shipped'}
              onClick={() => markShipped(item.id)}
            >
              Mark shipped
            </button>
            <button
              aria-label={`Delete ${item.title}`}
              onClick={() => deleteItem(item.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
