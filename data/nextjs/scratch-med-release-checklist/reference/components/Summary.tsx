'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { tasks } = useApp()
  const total = tasks.length
  const done = tasks.filter((t) => t.done).length
  const remaining = total - done
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  const ownerMap: Record<string, number> = {}
  tasks.forEach((t) => {
    if (t.done) return
    const key = t.owner === '' ? '(none)' : t.owner
    ownerMap[key] = (ownerMap[key] ?? 0) + 1
  })

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Done: ${done}`}</p>
      <p>{`Remaining: ${remaining}`}</p>
      <p>{`Completion: ${pct}%`}</p>
      <section aria-label="By owner">
        <h2>By owner</h2>
        {Object.keys(ownerMap).map((o) => (
          <p key={o}>{`${o}: ${ownerMap[o]} remaining`}</p>
        ))}
      </section>
    </section>
  )
}
