'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { tasks } = useApp()
  const total = tasks.length
  const done = tasks.filter((t) => t.done).length
  const remaining = total - done
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  // Build by-owner map
  const ownerMap: Record<string, number> = {}
  tasks.forEach((t) => {
    if (!t.done) {
      const key = t.owner || 'Unassigned'
      ownerMap[key] = (ownerMap[key] ?? 0) + 1
    }
  })
  const ownerEntries = Object.keys(ownerMap).sort()

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Done: ${done}`}</p>
      <p>{`Remaining: ${remaining}`}</p>
      <p>{`Completion: ${pct}%`}</p>
      <section aria-label="By Owner">
        <h2>By Owner</h2>
        <ul>
          {ownerEntries.map((owner) => (
            <li key={owner}>{`${owner}: ${ownerMap[owner]} remaining`}</li>
          ))}
        </ul>
      </section>
    </section>
  )
}
