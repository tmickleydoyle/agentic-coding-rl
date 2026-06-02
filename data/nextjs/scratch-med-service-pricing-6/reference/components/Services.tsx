'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Services() {
  const { services, filter, addService, deleteService, toggleActive, setFilter } = useApp()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  const visible = filter === 'all' ? services : services.filter(s => s.active)

  return (
    <section aria-label="Services view">
      <h1>{`Services (${visible.length})`}</h1>
      <div>
        <input
          aria-label="Service name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          aria-label="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <button onClick={() => { addService(name, price); setName(''); setPrice('') }}>
          Add service
        </button>
      </div>
      <div>
        <button
          aria-pressed={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          Show all
        </button>
        <button
          aria-pressed={filter === 'active'}
          onClick={() => setFilter('active')}
        >
          Show active only
        </button>
      </div>
      <ul>
        {visible.map(s => (
          <li key={s.id}>
            <span>{s.name}</span>
            <span>{`$${s.price.toFixed(2)}`}</span>
            <button onClick={() => toggleActive(s.id)}>
              {s.active ? 'Active' : 'Inactive'}
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
