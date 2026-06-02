'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { items } = useApp()
  const total = items.length
  const draft = items.filter((i) => i.status === 'draft').length
  const scheduled = items.filter((i) => i.status === 'scheduled').length
  const published = items.filter((i) => i.status === 'published').length
  const pct = total === 0 ? 0 : Math.round((scheduled / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Draft: ${draft}`}</p>
      <p>{`Scheduled: ${scheduled}`}</p>
      <p>{`Published: ${published}`}</p>
      <p>{`Scheduled: ${pct}%`}</p>
    </section>
  )
}
