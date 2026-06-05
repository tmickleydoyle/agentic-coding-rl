'use client'
import { useApp } from '../hooks/useApp'

export function StatsView() {
  const { bugs } = useApp()
  const total = bugs.length
  const openBugs = bugs.filter((b) => b.status === 'open')
  const closedCount = bugs.filter((b) => b.status === 'closed').length
  const openCount = openBugs.length
  const highOpen = openBugs.filter((b) => b.severity === 'high').length
  const mediumOpen = openBugs.filter((b) => b.severity === 'medium').length
  const lowOpen = openBugs.filter((b) => b.severity === 'low').length

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Open: ${openCount}`}</p>
      <p>{`Closed: ${closedCount}`}</p>
      <p>{`High open: ${highOpen}`}</p>
      <p>{`Medium open: ${mediumOpen}`}</p>
      <p>{`Low open: ${lowOpen}`}</p>
    </section>
  )
}
