'use client'
import { useState } from 'react'
import { useStudio } from '../hooks/useStudio'

export function Classes() {
  const { classes, addClass } = useStudio()
  const [name, setName] = useState('')
  const [capacity, setCapacity] = useState('')

  return (
    <section aria-label="Classes view">
      <h1>Classes</h1>
      <input aria-label="Class name" value={name} onChange={(e) => setName(e.target.value)} />
      <input
        aria-label="Capacity"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />
      <button
        onClick={() => {
          addClass(name, capacity)
          setName('')
          setCapacity('')
        }}
      >
        Add class
      </button>
      <ul>
        {classes.map((c) => (
          <li key={c.id}>{`${c.name} (capacity ${c.capacity})`}</li>
        ))}
      </ul>
    </section>
  )
}
