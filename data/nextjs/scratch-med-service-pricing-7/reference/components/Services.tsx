'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Services() {
  const { services, addService, removeService, toggleActive } = useApp()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const activeCount = services.filter((s) => s.active).length

  return (
    <section aria-label="Services view">
      <h1>Services</h1>
      <p>{`Active services: ${activeCount}`}</p>
      <input
        aria-label="Service name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        aria-label="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button
        onClick={() => {
          addService(name, price)
          setName('')
          setPrice('')
        }}
      >
        Add service
      </button>
      <ul>
        {services.map((s) => (
          <li key={s.id}>
            <span>{s.name}</span>
            <span>{`$${s.price.toFixed(2)}`}</span>
            <button aria-label={`Toggle ${s.name}`} onClick={() => toggleActive(s.id)}>
              {s.active ? 'Active' : 'Inactive'}
            </button>
            <button aria-label={`Remove ${s.name}`} onClick={() => removeService(s.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
