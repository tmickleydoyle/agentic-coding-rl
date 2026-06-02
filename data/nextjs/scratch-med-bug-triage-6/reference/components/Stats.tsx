'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { bugs } = useApp()
  const total = bugs.length
  const openBugs = bugs.filter((b) => b.status === 'open')
  const closedCount = bugs.filter((b) => b.status === 'closed').length
  const openCount = openBugs.length
  const openHigh = openBugs.filter((b) => b.severity === 'high').length
  const openMedium = openBugs.filter((b) => b.severity === 'medium').length
  const openLow = openBugs.filter((b) => b.severity === 'low').length

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total bugs: ${total}`}</p>
      <p>{`Open: ${openCount}`}</p>
      <p>{`Closed: ${closedCount}`}</p>
      <p>{`Open high: ${openHigh}`}</p>
      <p>{`Open medium: ${openMedium}`}</p>
      <p>{`Open low: ${openLow}`}</p>
    </section>
  )
}
