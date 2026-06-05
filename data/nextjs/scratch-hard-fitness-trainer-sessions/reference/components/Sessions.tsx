'use client'
import { useState } from 'react'
import { useStudio } from '../hooks/useStudio'

export function Sessions() {
  const { trainers, sessions, addSession } = useStudio()
  const [trainerId, setTrainerId] = useState('')
  const [client, setClient] = useState('')
  const [hours, setHours] = useState('')

  const nameOf = (id: number) => trainers.find((t) => t.id === id)?.name ?? ''

  return (
    <section aria-label="Sessions view">
      <h1>Sessions</h1>
      <select aria-label="Trainer" value={trainerId} onChange={(e) => setTrainerId(e.target.value)}>
        <option value="">Select a trainer</option>
        {trainers.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <input aria-label="Client name" value={client} onChange={(e) => setClient(e.target.value)} />
      <input
        aria-label="Hours"
        type="number"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />
      <button
        onClick={() => {
          addSession(trainerId, client, hours)
          setClient('')
          setHours('')
        }}
      >
        Add session
      </button>
      <ul>
        {sessions.map((s) => (
          <li key={s.id}>{`${s.client} with ${nameOf(s.trainerId)} (${s.hours}h)`}</li>
        ))}
      </ul>
    </section>
  )
}
