'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { OrderStatus } from '../lib/types'

const STATUS_OPTIONS: (OrderStatus | 'all')[] = ['all', 'new', 'packing', 'shipped', 'delivered']

export function Orders() {
  const { orders, addOrder, advanceOrder } = useApp()
  const [customer, setCustomer] = useState('')
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  const visible = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <section aria-label="Orders view">
      <h1>Orders</h1>
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
        <label htmlFor="filter-status">Filter by status</label>
        <select
          id="filter-status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as OrderStatus | 'all')}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All' : s}
            </option>
          ))}
        </select>
      </div>
      <p>{`Showing: ${visible.length} orders`}</p>
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
