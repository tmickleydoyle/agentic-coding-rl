'use client'
import { useApp } from '../hooks/useApp'
import { metricSummaries } from '../lib/utils'

export function Dashboard() {
  const { entries } = useApp()
  const summaries = metricSummaries(entries)

  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      {summaries.length === 0 ? (
        <p>No metrics logged yet</p>
      ) : (
        summaries.map((s) => (
          <section key={s.name} aria-label={`Metric ${s.name}`}>
            <h2>{s.name}</h2>
            <p>{`Latest: ${s.latest}`}</p>
            <p>{`Entries: ${s.count}`}</p>
            <p>{`Trend: ${s.trend}`}</p>
          </section>
        ))
      )}
    </section>
  )
}
