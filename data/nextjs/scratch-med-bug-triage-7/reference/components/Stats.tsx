'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { bugs } = useApp()
  const total = bugs.length
  const open = bugs.filter((b) => b.status === 'open').length
  const closed = bugs.filter((b) => b.status === 'closed').length
  const highOpen = bugs.filter((b) => b.status === 'open' && b.severity === 'High').length
  const medOpen = bugs.filter((b) => b.status === 'open' && b.severity === 'Medium').length
  const lowOpen = bugs.filter((b) => b.status === 'open' && b.severity === 'Low').length
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total bugs: ${total}`}</p>
      <p>{`Open: ${open}`}</p>
      <p>{`Closed: ${closed}`}</p>
      <p>{`High (open): ${highOpen}`}</p>
      <p>{`Medium (open): ${medOpen}`}</p>
      <p>{`Low (open): ${lowOpen}`}</p>
    </section>
  )
}
