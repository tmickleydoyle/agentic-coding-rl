'use client'
import { useApp } from '../hooks/useApp'
import type { ItemStatus } from '../lib/types'

export function StatsView() {
  const { items } = useApp()
  const total = items.length
  const count = (s: ItemStatus) => items.filter((x) => x.status === s).length
  const pct = total === 0 ? 0 : Math.round((count('scheduled') / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total items: ${total}`}</p>
      <p>{`Draft: ${count('draft')}`}</p>
      <p>{`Scheduled: ${count('scheduled')}`}</p>
      <p>{`Published: ${count('published')}`}</p>
      <p>{`Scheduled rate: ${pct}%`}</p>
    </section>
  )
}
