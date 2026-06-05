'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Orders() {
  const { orders, addOrder, advanceOrder, filter, setFilter } = useApp()
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
      <label>
        Filter by status
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">all</option>
          <option value="new">new</option>
          <option value="packing">packing</option>
          <option value="shipped">shipped</option>
          <option value="delivered">delivered</option>
        </select>
      </label>
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
