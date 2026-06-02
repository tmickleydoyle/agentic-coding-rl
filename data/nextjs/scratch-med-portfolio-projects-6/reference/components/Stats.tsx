'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { projects } = useApp()
  const total = projects.length
  const live = projects.filter((p) => p.status === 'live').length
  const draft = projects.filter((p) => p.status === 'draft').length
  const pct = total === 0 ? 0 : Math.round((live / total) * 100)
  const design = projects.filter((p) => p.category === 'Design').length
  const development = projects.filter((p) => p.category === 'Development').length
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total projects: ${total}`}</p>
      <p>{`Live: ${live}`}</p>
      <p>{`Draft: ${draft}`}</p>
      <p>{`Live rate: ${pct}%`}</p>
      <p>{`Design: ${design}`}</p>
      <p>{`Development: ${development}`}</p>
    </section>
  )
}
