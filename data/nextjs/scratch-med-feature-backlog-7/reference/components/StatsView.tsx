'use client'
import { useApp } from '../hooks/useApp'

export function StatsView() {
  const { features } = useApp()
  const total = features.length
  const p0 = features.filter((f) => f.priority === 'P0').length
  const p1 = features.filter((f) => f.priority === 'P1').length
  const p2 = features.filter((f) => f.priority === 'P2').length
  const shipped = features.filter((f) => f.status === 'shipped').length
  const pct = total === 0 ? 0 : Math.round((shipped / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`P0: ${p0}`}</p>
      <p>{`P1: ${p1}`}</p>
      <p>{`P2: ${p2}`}</p>
      <p>{`Shipped: ${shipped}`}</p>
      <p>{`Completion: ${pct}%`}</p>
    </section>
  )
}
