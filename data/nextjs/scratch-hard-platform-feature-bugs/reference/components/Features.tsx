'use client'
import { useState } from 'react'
import { usePlatform } from '../hooks/usePlatform'

export function Features() {
  const { features, addFeature } = usePlatform()
  const [name, setName] = useState('')
  return (
    <section aria-label="Features view">
      <h1>Features</h1>
      <input aria-label="Feature name" value={name} onChange={(e) => setName(e.target.value)} />
      <button
        onClick={() => {
          addFeature(name)
          setName('')
        }}
      >
        Add feature
      </button>
      <ul>
        {features.map((f) => (
          <li key={f.id}>{f.name}</li>
        ))}
      </ul>
    </section>
  )
}
