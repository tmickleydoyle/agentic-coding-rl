'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Quarter, Status } from '../lib/types'

const QUARTERS: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4']
const STATUSES: Status[] = ['planned', 'in-progress', 'shipped']

export function Roadmap() {
  const { items, addItem, shipItem, filterQuarter, setFilterQuarter } = useApp()
  const [title, setTitle] = useState('')
  const [quarter, setQuarter] = useState<Quarter>('Q1')
  const [status, setStatus] = useState<Status>('planned')

  const visible = filterQuarter === 'All' ? items : items.filter((i) => i.quarter === filterQuarter)
  const shippedTotal = items.filter((i) => i.status === 'shipped').length

  return (
    <section aria-label="Roadmap view">
      <h1>Roadmap</h1>
      <div>
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
        <select
          aria-label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={() => {
            addItem(title, quarter, status)
            setTitle('')
          }}
        >
          Add item
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by quarter"
          value={filterQuarter}
          onChange={(e) => setFilterQuarter(e.target.value)}
        >
          <option value="All">All</option>
          {QUARTERS.map((q) => (
            <option key={q} value={q}>{q}</option>
          ))}
        </select>
      </div>
      <p>{`Showing: ${visible.length} items`}</p>
      <p>{`Shipped: ${shippedTotal}`}</p>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <span>{item.quarter}</span>
            <span>{item.status}</span>
            <button
              aria-label={`Ship ${item.title}`}
              disabled={item.status === 'shipped'}
              onClick={() => shipItem(item.id)}
            >
              Ship
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
