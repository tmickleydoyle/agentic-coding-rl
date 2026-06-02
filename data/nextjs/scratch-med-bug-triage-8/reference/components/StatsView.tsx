'use client'
import { useApp } from '../hooks/useApp'

export function StatsView() {
  const { bugs } = useApp()
  const total = bugs.length
  const openCount = bugs.filter((b) => b.status === 'open').length
  const closedCount = bugs.filter((b) => b.status === 'closed').length
  const highOpen = bugs.filter((b) => b.status === 'open' && b.severity === 'High').length
  const mediumOpen = bugs.filter((b) => b.status === 'open' && b.severity === 'Medium').length
  const lowOpen = bugs.filter((b) => b.status === 'open' && b.severity === 'Low').length

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total bugs: ${total}`}</p>
      <p>{`Open: ${openCount}`}</p>
      <p>{`Closed: ${closedCount}`}</p>
      <p>{`High (open): ${highOpen}`}</p>
      <p>{`Medium (open): ${mediumOpen}`}</p>
      <p>{`Low (open): ${lowOpen}`}</p>
    </section>
  )
}
