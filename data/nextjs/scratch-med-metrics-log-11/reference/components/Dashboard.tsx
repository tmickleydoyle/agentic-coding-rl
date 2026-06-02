'use client'
import { useApp } from '../hooks/useApp'
import { getTrend } from '../lib/trend'

export function Dashboard() {
  const { entries } = useApp()

  if (entries.length === 0) {
    return (
      <section aria-label="Dashboard view">
        <h1>Dashboard</h1>
        <p>No entries yet</p>
      </section>
    )
  }

  // Build unique metric names in first-appearance order
  const metricNames: string[] = []
  entries.forEach((e) => {
    if (!metricNames.includes(e.name)) metricNames.push(e.name)
  })

  const total = entries.length
  const tracked = metricNames.length

  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total entries: ${total}`}</p>
      <ul>
        {metricNames.map((metricName) => {
          const metricEntries = entries.filter((e) => e.name === metricName)
          const latest = metricEntries[metricEntries.length - 1]
          const trend = getTrend(entries, latest)
          return (
            <li key={metricName}>{`${metricName}: ${latest.value} ${trend}`}</li>
          )
        })}
      </ul>
      <p>{`Tracked metrics: ${tracked}`}</p>
    </section>
  )
}
