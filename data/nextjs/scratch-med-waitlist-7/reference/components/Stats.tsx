'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { entries } = useApp()
  const total = entries.length
  const invited = entries.filter((e) => e.status === 'invited').length
  const pending = entries.filter((e) => e.status === 'pending').length
  const rate = total === 0 ? 0 : Math.round((invited / total) * 100)

  const sourceCounts: Record<string, number> = {}
  entries.forEach((e) => {
    sourceCounts[e.source] = (sourceCounts[e.source] ?? 0) + 1
  })
  const sources = Object.keys(sourceCounts).sort()

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Invited: ${invited}`}</p>
      <p>{`Pending: ${pending}`}</p>
      <p>{`Invite rate: ${rate}%`}</p>
      <h2>By Source</h2>
      <ul>
        {sources.map((s) => (
          <li key={s}>{`${s}: ${sourceCounts[s]}`}</li>
        ))}
      </ul>
    </section>
  )
}
