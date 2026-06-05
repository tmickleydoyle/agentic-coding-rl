'use client'
import { useState } from 'react'
import { usePlatform } from '../hooks/usePlatform'

export function Tickets() {
  const { releases, tickets, addTicket, resolveTicket } = usePlatform()
  const [releaseId, setReleaseId] = useState('')
  const [summary, setSummary] = useState('')
  const [points, setPoints] = useState('')

  const nameOf = (id: number) => releases.find((r) => r.id === id)?.name ?? ''

  return (
    <section aria-label="Tickets view">
      <h1>Tickets</h1>
      <select aria-label="Release" value={releaseId} onChange={(e) => setReleaseId(e.target.value)}>
        <option value="">Select a release</option>
        {releases.map((r) => (
          <option key={r.id} value={String(r.id)}>
            {r.name}
          </option>
        ))}
      </select>
      <input aria-label="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
      <input
        aria-label="Points"
        type="number"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
      />
      <button
        onClick={() => {
          addTicket(releaseId, summary, points)
          setSummary('')
          setPoints('')
        }}
      >
        Add ticket
      </button>
      <ul>
        {tickets.map((t) => (
          <li key={t.id}>
            <span>{`${t.summary} (${t.points} pts) - ${t.done ? 'done' : 'todo'} [${nameOf(
              t.releaseId,
            )}]`}</span>
            {!t.done && <button onClick={() => resolveTicket(t.id)}>Resolve</button>}
          </li>
        ))}
      </ul>
    </section>
  )
}
