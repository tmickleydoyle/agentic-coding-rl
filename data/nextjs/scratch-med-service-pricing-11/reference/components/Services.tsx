'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { fmt } from '../lib/fmt'

export function Services() {
  const { services, addService, toggleService, deleteService } = useApp()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [activeOnly, setActiveOnly] = useState(false)

  const visible = activeOnly ? services.filter((s) => s.active) : services

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
      <label>
        <input
          type="checkbox"
          aria-label="Active only"
          checked={activeOnly}
          onChange={() => setActiveOnly((v) => !v)}
        />
        Active only
      </label>
      <ul>
        {visible.map((svc) => (
          <li key={svc.id}>
            <span>{svc.name}</span>
            <span>{fmt(svc.price)}</span>
            <button
              aria-label={`${svc.active ? 'Deactivate' : 'Activate'} ${svc.name}`}
              onClick={() => toggleService(svc.id)}
            >
              {svc.active ? 'Deactivate' : 'Activate'}
            </button>
            <button
              aria-label={`Delete ${svc.name}`}
              onClick={() => deleteService(svc.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
