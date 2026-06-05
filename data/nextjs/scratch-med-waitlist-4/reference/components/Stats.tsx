'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { entries } = useApp()
  const total = entries.length
  const pending = entries.filter((e) => e.status === 'pending').length
  const invited = entries.filter((e) => e.status === 'invited').length
  const pct = total === 0 ? 0 : Math.round((invited / total) * 100)

  const sourceMap: Record<string, number> = {}
  entries.forEach((e) => {
    sourceMap[e.source] = (sourceMap[e.source] || 0) + 1
  })
  const sources = Object.keys(sourceMap)

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total signups: ${total}`}</p>
      <p>{`Pending: ${pending}`}</p>
      <p>{`Invited: ${invited}`}</p>
      <p>{`Invite rate: ${pct}%`}</p>
      <h2>By source</h2>
      <ul>
        {sources.map((src) => (
          <li key={src}>{`${src}: ${sourceMap[src]}`}</li>
        ))}
      </ul>
    </section>
  )
}
