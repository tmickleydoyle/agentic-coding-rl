'use client'
import { useState } from 'react'
import { useFunnel } from '../hooks/useFunnel'

export function Funnels() {
  const { funnels, steps, addFunnel } = useFunnel()
  const [name, setName] = useState('')

  return (
    <section aria-label="Funnels view">
      <h1>Funnels</h1>
      <input aria-label="Funnel name" value={name} onChange={(e) => setName(e.target.value)} />
      <button
        onClick={() => {
          addFunnel(name)
          setName('')
        }}
      >
        Add funnel
      </button>
      <ul>
        {funnels.map((f) => {
          const count = steps.filter((s) => s.funnelId === f.id).length
          return <li key={f.id}>{`${f.name} (${count} steps)`}</li>
        })}
      </ul>
    </section>
  )
}
