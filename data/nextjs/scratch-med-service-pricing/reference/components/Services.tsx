'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Services() {
  const { services, addService, deleteService, toggleActive, hideInactive } = useApp()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  const activeCount = services.filter((s) => s.active).length
  const total = services.length
  const visible = hideInactive ? services.filter((s) => s.active) : services

  return (
    <section aria-label="Services view">
      <h1>Services</h1>
      <p>{`Active: ${activeCount} of ${total}`}</p>
      <input
        aria-label="Service name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        aria-label="Price ($)"
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
        {visible.map((s) => (
          <li key={s.id}>
            <span>{s.name}</span>
            <span>{`$${s.price.toFixed(2)}`}</span>
            <button onClick={() => toggleActive(s.id)}>
              {s.active ? 'Deactivate' : 'Activate'}
            </button>
            <button aria-label={`Delete ${s.name}`} onClick={() => deleteService(s.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
