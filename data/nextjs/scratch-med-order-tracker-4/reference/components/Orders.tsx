'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { OrderStatus } from '../lib/types'

const STATUS_LABELS: OrderStatus[] = ['new', 'packing', 'shipped', 'delivered']

export function Orders() {
  const { orders, filter, addOrder, advanceOrder, setFilter } = useApp()
  const [customer, setCustomer] = useState('')

  const countAll = orders.length
  const countFor = (s: OrderStatus) => orders.filter((o) => o.status === s).length

  const visibleOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

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
      <div aria-label="Filter controls">
        <button onClick={() => setFilter('all')}>{`All (${countAll})`}</button>
        {STATUS_LABELS.map((s) => {
          const label = s.charAt(0).toUpperCase() + s.slice(1)
          return (
            <button key={s} onClick={() => setFilter(s)}>
              {filter === s ? `${label} (${countFor(s)})` : label}
            </button>
          )
        })}
      </div>
      <ul>
        {visibleOrders.map((o) => (
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
