'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Services() {
  const { services, addService, toggleActive, hideInactive } = useApp()
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
    </section>
  )
}
