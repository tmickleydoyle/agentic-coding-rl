'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { OrderStatus } from '../lib/types'

const STATUS_OPTIONS: { value: 'all' | OrderStatus; label: string }[] = [
  { value: 'all', label: 'all' },
  { value: 'new', label: 'new' },
  { value: 'packing', label: 'packing' },
  { value: 'shipped', label: 'shipped' },
  { value: 'delivered', label: 'delivered' },
]

export function Orders() {
  const { orders, addOrder, advanceOrder } = useApp()
  const [customer, setCustomer] = useState('')
  const [filter, setFilter] = useState<'all' | OrderStatus>('all')

  const visible = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <section aria-label="Orders view">
      <h1>Orders</h1>
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
      <div>
        <label htmlFor="filter-status">Filter by status</label>
        <select
          id="filter-status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | OrderStatus)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <p>{`Showing: ${visible.length}`}</p>
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
