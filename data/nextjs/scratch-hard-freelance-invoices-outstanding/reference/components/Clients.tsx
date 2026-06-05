'use client'
import { useState } from 'react'
import { useStudio } from '../hooks/useStudio'

export function Clients() {
  const { invoices, clients, addClient } = useStudio()
  const [name, setName] = useState('')

  return (
    <section aria-label="Clients view">
      <h1>Clients</h1>
      <ul>
        {clients.map((c) => {
          const unpaid = invoices.filter((iv) => iv.client === c && !iv.paid)
          const outstanding = unpaid.reduce((s, iv) => s + iv.amount, 0)
          return (
            <li key={c}>
              {`${c}: $${outstanding} outstanding across ${unpaid.length} unpaid`}
            </li>
          )
        })}
      </ul>
      <input aria-label="Client name" value={name} onChange={(e) => setName(e.target.value)} />
      <button
        onClick={() => {
          addClient(name)
          setName('')
        }}
      >
        Add client
      </button>
    </section>
  )
}
