'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

const STATUS_OPTIONS = ['All', 'new', 'packing', 'shipped', 'delivered']

export function Orders() {
  const { orders, filter, addOrder, advanceOrder, setFilter } = useApp()
  const [customer, setCustomer] = useState('')

  const visible = filter === 'All' ? orders : orders.filter((o) => o.status === filter)

  return (
    <section aria-label="Orders view">
      <h1>{`Orders (${visible.length})`}</h1>
      <div>
        <input
          aria-label="Customer name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
        <button
          onClick={() => {
            addOrder(customer)
            setCustomer('')
          }}
        >
          Add order
        </button>
      </div>
      <div>
        <label htmlFor="filter-select">Filter by status</label>
        <select
          id="filter-select"
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {visible.map((o) => (
          <li key={o.id}>
            <span>{o.customer}</span>
            <span>{o.status}</span>
            <button
              aria-label={`Advance ${o.customer}`}
              disabled={o.status === 'delivered'}
              onClick={() => advanceOrder(o.id)}
            >
              Advance
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
