'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { OrderStatus } from '../lib/types'

type Filter = 'all' | OrderStatus

const FILTERS: [Filter, string][] = [
  ['all', 'All'],
  ['new', 'New'],
  ['packing', 'Packing'],
  ['shipped', 'Shipped'],
  ['delivered', 'Delivered'],
]

export function Orders() {
  const { orders, addOrder, advanceOrder } = useApp()
  const [customer, setCustomer] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

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
      <div aria-label="Filter by status">
        {FILTERS.map(([f, label]) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
          >
            {label}
          </button>
        ))}
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
