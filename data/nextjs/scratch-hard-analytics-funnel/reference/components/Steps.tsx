'use client'
import { useState } from 'react'
import { useFunnel } from '../hooks/useFunnel'

export function Steps() {
  const { funnels, steps, addStep } = useFunnel()
  const [funnelId, setFunnelId] = useState('')
  const [name, setName] = useState('')
  const [users, setUsers] = useState('')

  return (
    <section aria-label="Steps view">
      <h1>Steps</h1>
      <select aria-label="Funnel" value={funnelId} onChange={(e) => setFunnelId(e.target.value)}>
        <option value="">Select funnel</option>
        {funnels.map((f) => (
          <option key={f.id} value={String(f.id)}>
            {f.name}
          </option>
        ))}
      </select>
      <input aria-label="Step name" value={name} onChange={(e) => setName(e.target.value)} />
      <input
        aria-label="Users"
        type="number"
        value={users}
        onChange={(e) => setUsers(e.target.value)}
      />
      <button
        onClick={() => {
          addStep(funnelId, name, users)
          setName('')
          setUsers('')
        }}
      >
        Add step
      </button>
      <ul>
        {steps.map((s) => (
          <li key={s.id}>{`${s.name}: ${s.users} users`}</li>
        ))}
      </ul>
    </section>
  )
}
