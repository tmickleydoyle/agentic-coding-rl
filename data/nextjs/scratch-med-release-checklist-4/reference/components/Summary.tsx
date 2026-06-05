'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { tasks } = useApp()
  const total = tasks.length
  const completed = tasks.filter((t) => t.done).length
  const remaining = total - completed
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  const ownerMap: Record<string, number> = {}
  tasks.forEach((t) => {
    if (!t.done) {
      ownerMap[t.owner] = (ownerMap[t.owner] ?? 0) + 1
    }
  })
  const ownerEntries = Object.keys(ownerMap).map((o) => ({ owner: o, count: ownerMap[o] }))

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total tasks: ${total}`}</p>
      <p>{`Completed: ${completed}`}</p>
      <p>{`Remaining: ${remaining}`}</p>
      <p>{`Completion: ${pct}%`}</p>
      <h2>By owner</h2>
      <ul>
        {ownerEntries.map(({ owner, count }) => (
          <li key={owner}>{`${owner}: ${count} remaining`}</li>
        ))}
      </ul>
    </section>
  )
}
