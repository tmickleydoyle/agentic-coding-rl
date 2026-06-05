'use client'
import { useApp } from '../hooks/useApp'
import { getTrend } from '../lib/utils'

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

  // unique metric names in first-logged order
  const seen: string[] = []
  entries.forEach((e) => {
    if (!seen.includes(e.name)) seen.push(e.name)
  })

  const uniqueCount = seen.length
  const totalCount = entries.length

  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total entries: ${totalCount}`}</p>
      <p>{`Unique metrics: ${uniqueCount}`}</p>
      {seen.map((metricName) => {
        const metricEntries = entries
          .filter((e) => e.name === metricName)
          .sort((a, b) => a.order - b.order)
        const latest = metricEntries[metricEntries.length - 1]
        const trend = getTrend(entries, latest)
        return (
          <p key={metricName}>{`${metricName}: latest=${latest.value} trend=${trend}`}</p>
        )
      })}
    </section>
  )
}
