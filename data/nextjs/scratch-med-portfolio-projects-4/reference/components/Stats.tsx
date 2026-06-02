'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { projects } = useApp()
  const total = projects.length
  const live = projects.filter((p) => p.status === 'live').length
  const draft = projects.filter((p) => p.status === 'draft').length
  const pct = total === 0 ? 0 : Math.round((live / total) * 100)

  const catMap: Record<string, number> = {}
  projects.forEach((p) => {
    catMap[p.category] = (catMap[p.category] ?? 0) + 1
  })
  const categories = Object.keys(catMap)

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total projects: ${total}`}</p>
      <p>{`Live: ${live}`}</p>
      <p>{`Draft: ${draft}`}</p>
      <p>{`Live rate: ${pct}%`}</p>
      <ul>
        {categories.map((cat) => (
          <li key={cat}>{`${cat}: ${catMap[cat]}`}</li>
        ))}
      </ul>
    </section>
  )
}
