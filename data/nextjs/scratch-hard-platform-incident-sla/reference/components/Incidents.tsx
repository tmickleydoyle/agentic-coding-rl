'use client'
import { useState } from 'react'
import { usePlatform } from '../hooks/usePlatform'
import { PRIORITIES } from '../lib/types'
import type { Priority } from '../lib/types'

export function Incidents() {
  const { incidents, logIncident, resolveIncident } = usePlatform()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('P1')
  const [hours, setHours] = useState('')

  return (
    <section aria-label="Incidents view">
      <h1>Incidents</h1>
      <input aria-label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <select
        aria-label="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <input
        aria-label="Hours open"
        type="number"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />
      <button
        onClick={() => {
          logIncident(title, priority, hours)
          setTitle('')
          setHours('')
        }}
      >
        Log incident
      </button>
      <ul>
        {incidents.map((i) => (
          <li key={i.id}>
            <span>{`${i.title} [${i.priority}] - ${i.hours}h - ${
              i.active ? 'active' : 'resolved'
            }`}</span>
            {i.active && <button onClick={() => resolveIncident(i.id)}>Resolve</button>}
          </li>
        ))}
      </ul>
    </section>
  )
}
