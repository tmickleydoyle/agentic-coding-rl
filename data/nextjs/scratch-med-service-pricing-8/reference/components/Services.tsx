'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { fmt } from '../lib/fmt'

export function Services() {
  const { services, addService, toggleService, activeOnly, setActiveOnly } = useApp()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  const displayed = activeOnly ? services.filter((s) => s.active) : services

  function handleAdd() {
    const p = parseFloat(price)
    addService(name, p)
    setName('')
    setPrice('')
  }

  return (
    <section aria-label="Services view">
      <h1>{`Services (${services.length})`}</h1>
      <div>
        <input
          aria-label="Service name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          aria-label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          min="0"
          step="0.01"
        />
        <button onClick={handleAdd}>Add service</button>
      </div>
      <label>
        <input
          type="checkbox"
          aria-label="Active only"
          checked={activeOnly}
          onChange={(e) => setActiveOnly(e.target.checked)}
        />
        Active only
      </label>
      <ul>
        {displayed.map((svc) => (
          <li key={svc.id}>
            <span>{svc.name}</span>
            <span>{fmt(svc.price)}</span>
            <button
              aria-label={svc.active ? `Deactivate ${svc.name}` : `Activate ${svc.name}`}
              onClick={() => toggleService(svc.id)}
            >
              {svc.active ? 'Deactivate' : 'Activate'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
