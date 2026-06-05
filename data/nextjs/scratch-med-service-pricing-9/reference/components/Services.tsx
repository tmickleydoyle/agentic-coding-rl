'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

function fmt(price: number) {
  return `$${price.toFixed(2)}`
}

export function Services() {
  const { services, filter, addService, toggleActive, setFilter } = useApp()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  const visible = filter === 'active' ? services.filter((s) => s.active) : services

  return (
    <section aria-label="Services view">
      <h1>{`Services (${visible.length})`}</h1>
      <div>
        <input
          aria-label="Service name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          aria-label="Price ($)"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button
          onClick={() => {
            const p = parseFloat(price)
            addService(name, p)
            setName('')
            setPrice('')
          }}
        >
          Add service
        </button>
      </div>
      <div>
        <button onClick={() => setFilter('all')} aria-pressed={filter === 'all'}>
          Show All
        </button>
        <button onClick={() => setFilter('active')} aria-pressed={filter === 'active'}>
          Show Active
        </button>
      </div>
      <ul>
        {visible.map((svc) => (
          <li key={svc.id}>
            <span>{svc.name}</span>
            <span>{fmt(svc.price)}</span>
            <span>{svc.active ? 'Active' : 'Inactive'}</span>
            <button aria-label={`Toggle ${svc.name}`} onClick={() => toggleActive(svc.id)}>
              Toggle
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
