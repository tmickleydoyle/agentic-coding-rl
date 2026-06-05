'use client'
import { useApp } from '../hooks/useApp'
import type { Category } from '../lib/types'

const CATEGORIES: Category[] = ['Web', 'Mobile', 'Design']

export function Stats() {
  const { projects } = useApp()
  const total = projects.length
  const liveCount = projects.filter((p) => p.status === 'Live').length
  const draftCount = projects.filter((p) => p.status === 'Draft').length
  const pct = total === 0 ? 0 : Math.round((liveCount / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total projects: ${total}`}</p>
      <p>{`Live: ${liveCount}`}</p>
      <p>{`Draft: ${draftCount}`}</p>
      {CATEGORIES.map((c) => (
        <p key={c}>{`${c}: ${projects.filter((p) => p.category === c).length}`}</p>
      ))}
      <p>{`Live rate: ${pct}%`}</p>
    </section>
  )
}
