'use client'
import { useApp } from '../hooks/useApp'

export function Dashboard() {
  const { entries, decimals } = useApp()

  if (entries.length === 0) {
    return (
      <section aria-label="Dashboard view">
        <h1>Dashboard</h1>
        <p>No data yet</p>
      </section>
    )
  }

  const total = entries.length

  // collect unique metric names in order of first appearance
  const seen: string[] = []
  entries.forEach((e) => {
    if (!seen.includes(e.name)) seen.push(e.name)
  })

  const unique = seen.length

  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total entries: ${total}`}</p>
      <p>{`Unique metrics: ${unique}`}</p>
      {seen.map((metricName) => {
        const metricEntries = entries.filter((e) => e.name === metricName)
        const latest = metricEntries[metricEntries.length - 1]
        const count = metricEntries.length
        return (
          <p key={metricName}>{`${metricName}: latest ${latest.value.toFixed(decimals)}, entries ${count}`}</p>
        )
      })}
    </section>
  )
}
