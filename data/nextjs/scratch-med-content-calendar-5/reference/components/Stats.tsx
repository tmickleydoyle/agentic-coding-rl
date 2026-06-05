'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { posts } = useApp()
  const total = posts.length
  const draft = posts.filter((p) => p.status === 'draft').length
  const scheduled = posts.filter((p) => p.status === 'scheduled').length
  const published = posts.filter((p) => p.status === 'published').length
  const pct = total === 0 ? 0 : Math.round((scheduled / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total posts: ${total}`}</p>
      <p>{`Draft: ${draft}`}</p>
      <p>{`Scheduled: ${scheduled}`}</p>
      <p>{`Published: ${published}`}</p>
      <p>{`Scheduled rate: ${pct}%`}</p>
    </section>
  )
}
