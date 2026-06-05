'use client'
import { usePlatform } from '../hooks/usePlatform'
import { slaState } from '../lib/sla'

export function Board() {
  const { incidents } = usePlatform()
  const active = incidents.filter((i) => i.active)
  return (
    <section aria-label="Board view">
      <h1>Board</h1>
      {active.length === 0 ? (
        <p>No active incidents</p>
      ) : (
        <ul>
          {active.map((i) => (
            <li key={i.id}>{`${i.title}: ${slaState(i)}`}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
