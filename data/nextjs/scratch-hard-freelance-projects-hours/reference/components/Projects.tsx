'use client'
import { useState } from 'react'
import { useStudio } from '../hooks/useStudio'

export function Projects() {
  const { entries, projects, addProject } = useStudio()
  const [name, setName] = useState('')
  const [rate, setRate] = useState('')

  return (
    <section aria-label="Projects view">
      <h1>Projects</h1>
      <ul>
        {projects.map((p) => {
          const mine = entries.filter((e) => e.project === p.name)
          const totalHours = mine.reduce((s, e) => s + e.hours, 0)
          const billableHours = mine.filter((e) => e.billable).reduce((s, e) => s + e.hours, 0)
          const amount = billableHours * p.rate
          return <li key={p.name}>{`${p.name}: ${totalHours} h, $${amount} billable`}</li>
        })}
      </ul>
      <input aria-label="Project name" value={name} onChange={(e) => setName(e.target.value)} />
      <input aria-label="Rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
      <button
        onClick={() => {
          addProject(name, rate)
          setName('')
          setRate('')
        }}
      >
        Add project
      </button>
    </section>
  )
}
