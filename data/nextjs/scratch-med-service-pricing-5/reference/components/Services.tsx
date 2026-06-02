'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Services() {
  const { services, filter, addService, toggleActive, setFilter } = useApp()
  const [name, setName] = useState('')
  const [priceStr, setPriceStr] = useState('')

  const total = services.length
  const activeCount = services.filter((s) => s.active).length

  const displayed = filter === 'active' ? services.filter((s) => s.active) : services

  function handleAdd() {
    const price = parseFloat(priceStr)
    addService(name, price)
    setName('')
    setPriceStr('')
  }

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
          aria-label="Price"
          value={priceStr}
          onChange={(e) => setPriceStr(e.target.value)}
          type="number"
          min="0"
          step="0.01"
        />
        <button onClick={handleAdd}>Add service</button>
      </div>
      <div>
        <button onClick={() => setFilter('all')}>Show all</button>
        <button onClick={() => setFilter('active')}>Show active only</button>
      </div>
      <p>{`Active: ${activeCount} of ${total}`}</p>
      <ul>
        {displayed.map((svc) => (
          <li key={svc.id}>
            <span>{svc.name}</span>
            <span>{`$${svc.price.toFixed(2)}`}</span>
            <button onClick={() => toggleActive(svc.id)}>
              {svc.active ? 'Deactivate' : 'Activate'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
