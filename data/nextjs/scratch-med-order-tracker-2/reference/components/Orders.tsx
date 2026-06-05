'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { OrderStatus } from '../lib/types'

const STATUSES: OrderStatus[] = ['new', 'packing', 'shipped', 'delivered']

export function Orders() {
  const { orders, addOrder, advanceOrder } = useApp()
  const [customer, setCustomer] = useState('')
  const [filter, setFilter] = useState<'all' | OrderStatus>('all')

  const visible = filter === 'all' ? orders : orders.filter((o) => o.status === filter)
  const countOf = (s: OrderStatus) => orders.filter((o) => o.status === s).length

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
      <div aria-label="Status counts">
        {STATUSES.map((s) => (
          <span key={s}>{`${s} (${countOf(s)})`}</span>
        ))}
      </div>
      <div>
        <label htmlFor="filter-select">Filter by status</label>
        <select
          id="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | OrderStatus)}
        >
          <option value="all">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
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
