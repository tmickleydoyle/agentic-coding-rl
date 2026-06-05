'use client'
import { useState } from 'react'
import { useStudio } from '../hooks/useStudio'

export function Trainers() {
  const { trainers, addTrainer } = useStudio()
  const [name, setName] = useState('')
  const [cap, setCap] = useState('')

  return (
    <section aria-label="Trainers view">
      <h1>Trainers</h1>
      <input aria-label="Trainer name" value={name} onChange={(e) => setName(e.target.value)} />
      <input
        aria-label="Weekly hour cap"
        type="number"
        value={cap}
        onChange={(e) => setCap(e.target.value)}
      />
      <button
        onClick={() => {
          addTrainer(name, cap)
          setName('')
          setCap('')
        }}
      >
        Add trainer
      </button>
      <ul>
        {trainers.map((t) => (
          <li key={t.id}>{`${t.name} (cap ${t.cap}h)`}</li>
        ))}
      </ul>
    </section>
  )
}
