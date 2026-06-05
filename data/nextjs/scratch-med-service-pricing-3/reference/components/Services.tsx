'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

function fmt(n: number): string {
  return `$${n.toFixed(2)}`
}

export function Services() {
  const { services, addService, toggleActive, deleteService, showInactive } = useApp()
  const [name, setName] = useState('')
  const [priceStr, setPriceStr] = useState('')

  const activeCount = services.filter((s) => s.active).length
  const totalCount = services.length

  const visible = showInactive ? services : services.filter((s) => s.active)

  function handleAdd() {
    const price = parseFloat(priceStr)
    addService(name, price)
    setName('')
    setPriceStr('')
  }

  return (
    <section aria-label="Services view">
      <h1>Services</h1>
      <p>{`Active: ${activeCount}`}</p>
      <p>{`Total: ${totalCount}`}</p>
      <input
        aria-label="Service name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        aria-label="Price ($)"
        value={priceStr}
        onChange={(e) => setPriceStr(e.target.value)}
        type="number"
        min="0"
        step="0.01"
      />
      <button onClick={handleAdd}>Add service</button>
      <ul>
        {visible.map((svc) => (
          <li key={svc.id}>
            <span>{svc.name}</span>
            <span>{fmt(svc.price)}</span>
            <button onClick={() => toggleActive(svc.id)}>
              {svc.active ? 'Deactivate' : 'Activate'}
            </button>
            <button onClick={() => deleteService(svc.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
