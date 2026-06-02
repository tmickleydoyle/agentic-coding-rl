'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { projects } = useApp()
  const total = projects.length
  const liveCount = projects.filter((p) => p.status === 'live').length
  const draftCount = projects.filter((p) => p.status === 'draft').length
  const pct = total === 0 ? 0 : Math.round((liveCount / total) * 100)

  const categoryMap: Record<string, number> = {}
  projects.forEach((p) => {
    const cat = p.category || ''
    categoryMap[cat] = (categoryMap[cat] || 0) + 1
  })

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total projects: ${total}`}</p>
      <p>{`Live: ${liveCount}`}</p>
      <p>{`Draft: ${draftCount}`}</p>
      <p>{`Live rate: ${pct}%`}</p>
      <ul>
        {Object.keys(categoryMap).map((cat) => (
          <li key={cat}>{`${cat}: ${categoryMap[cat]} projects`}</li>
        ))}
      </ul>
    </section>
  )
}
