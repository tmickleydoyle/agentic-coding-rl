'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { OrderStatus } from '../lib/types'

const FILTER_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'new' },
  { value: 'packing', label: 'packing' },
  { value: 'shipped', label: 'shipped' },
  { value: 'delivered', label: 'delivered' },
]

export function Orders() {
  const { orders, filter, addOrder, advanceOrder, setFilter } = useApp()
  const [customer, setCustomer] = useState('')

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
      <label htmlFor="filter-select">Filter by status</label>
      <select
        id="filter-select"
        aria-label="Filter by status"
        value={filter}
        onChange={(e) => setFilter(e.target.value as OrderStatus | 'all')}
      >
        {FILTER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <h2>{`Orders (${visible.length})`}</h2>
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
