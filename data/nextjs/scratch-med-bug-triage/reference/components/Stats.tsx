'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { bugs } = useApp()
  const total = bugs.length
  const open = bugs.filter((b) => b.status === 'open').length
  const closed = bugs.filter((b) => b.status === 'closed').length
  const openHigh = bugs.filter((b) => b.status === 'open' && b.severity === 'high').length
  const openMed = bugs.filter((b) => b.status === 'open' && b.severity === 'medium').length
  const openLow = bugs.filter((b) => b.status === 'open' && b.severity === 'low').length
  const pct = total === 0 ? 0 : Math.round((closed / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total bugs: ${total}`}</p>
      <p>{`Open: ${open}`}</p>
      <p>{`Closed: ${closed}`}</p>
      <p>{`Open high severity: ${openHigh}`}</p>
      <p>{`Open medium severity: ${openMed}`}</p>
      <p>{`Open low severity: ${openLow}`}</p>
      <p>{`Closed rate: ${pct}%`}</p>
    </section>
  )
}
