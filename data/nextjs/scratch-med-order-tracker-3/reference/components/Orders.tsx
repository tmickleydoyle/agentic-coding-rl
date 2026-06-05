'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { OrderStatus } from '../lib/types'

const FILTERS: Array<'All' | OrderStatus> = ['All', 'new', 'packing', 'shipped', 'delivered']

export function Orders() {
  const { orders, filter, setFilter, addOrder, advanceOrder } = useApp()
  const [name, setName] = useState('')

  const visible = filter === 'All' ? orders : orders.filter((o) => o.status === filter)

  return (
    <section aria-label="Orders view">
      <h1>Orders</h1>
      <div>
        <input
          aria-label="Customer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={() => {
            addOrder(name)
            setName('')
          }}
        >
          Add order
        </button>
      </div>
      <div>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f ? true : undefined}
          >
            {f}
          </button>
        ))}
      </div>
      <p>{`Showing: ${visible.length} order(s)`}</p>
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
