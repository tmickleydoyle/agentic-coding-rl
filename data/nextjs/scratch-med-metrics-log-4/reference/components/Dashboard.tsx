'use client'
import { useApp } from '../hooks/useApp'

export function Dashboard() {
  const { entries } = useApp()

  if (entries.length === 0) {
    return (
      <section aria-label="Dashboard view">
        <h1>Dashboard</h1>
        <p>No data yet</p>
      </section>
    )
  }

  // collect distinct metric names in order of first appearance
  const seen: string[] = []
  entries.forEach((e) => {
    if (!seen.includes(e.name)) seen.push(e.name)
  })

  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      {seen.map((metricName) => {
        const metricEntries = entries.filter((e) => e.name === metricName)
        const count = metricEntries.length
        const latest = metricEntries[metricEntries.length - 1].value
        return (
          <p key={metricName}>{`${metricName}: ${count} entries, latest ${latest}`}</p>
        )
      })}
      <p>{`Total entries: ${entries.length}`}</p>
    </section>
  )
}
