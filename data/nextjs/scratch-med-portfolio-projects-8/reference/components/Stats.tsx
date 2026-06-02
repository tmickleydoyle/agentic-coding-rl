'use client'
import { useApp } from '../hooks/useApp'
import type { Category } from '../lib/types'

const CATEGORIES: Category[] = ['Web', 'Mobile', 'Design', 'Other']

export function Stats() {
  const { projects } = useApp()
  const total = projects.length
  const live = projects.filter((p) => p.status === 'Live').length
  const draft = projects.filter((p) => p.status === 'Draft').length
  const pct = total === 0 ? 0 : Math.round((live / total) * 100)
  const catCount = (cat: Category) => projects.filter((p) => p.category === cat).length

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total projects: ${total}`}</p>
      <p>{`Live: ${live}`}</p>
      <p>{`Draft: ${draft}`}</p>
      {CATEGORIES.map((c) => (
        <p key={c}>{`${c}: ${catCount(c)}`}</p>
      ))}
      <p>{`Live rate: ${pct}%`}</p>
    </section>
  )
}
