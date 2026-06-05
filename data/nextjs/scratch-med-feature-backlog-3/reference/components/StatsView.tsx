'use client'
import { useApp } from '../hooks/useApp'
import type { Status } from '../lib/types'

export function StatsView() {
  const { features } = useApp()
  const total = features.length
  const count = (s: Status) => features.filter((f) => f.status === s).length
  const pct = total === 0 ? 0 : Math.round((count('shipped') / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total features: ${total}`}</p>
      <p>{`Idea: ${count('idea')}`}</p>
      <p>{`Building: ${count('building')}`}</p>
      <p>{`Shipped: ${count('shipped')}`}</p>
      <p>{`Shipped %: ${pct}%`}</p>
    </section>
  )
}
