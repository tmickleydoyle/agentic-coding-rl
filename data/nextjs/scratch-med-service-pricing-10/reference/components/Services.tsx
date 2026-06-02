'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Services() {
  const { services, addService, toggleActive, showInactive } = useApp()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  const activeCount = services.filter((s) => s.active).length
  const total = services.length
  const visible = services.filter((s) => showInactive || s.active)

  return (
    <section aria-label="Services view">
      <h1>Services</h1>
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
      <ul>
        {visible.map((svc) => (
          <li key={svc.id}>
            <span>{svc.name}</span>
            <span>{`$${svc.price.toFixed(2)}`}</span>
            <button
              aria-label={`Toggle ${svc.name}`}
              onClick={() => toggleActive(svc.id)}
            >
              {svc.active ? 'Active' : 'Inactive'}
            </button>
          </li>
        ))}
      </ul>
      <p>{`Active: ${activeCount} of ${total}`}</p>
    </section>
  )
}
