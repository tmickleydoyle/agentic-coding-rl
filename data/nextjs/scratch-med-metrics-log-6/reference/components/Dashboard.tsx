'use client'
import { useApp } from '../hooks/useApp'
import { getLatestPerMetric } from '../lib/metrics'

export function Dashboard() {
  const { entries } = useApp()
  const rows = getLatestPerMetric(entries)
  const totalEntries = entries.length
  const distinctMetrics = rows.length
  const rising = rows.filter((r) => r.trend === '▲').length
  const falling = rows.filter((r) => r.trend === '▼').length
  const stable = rows.filter((r) => r.trend === '—').length

  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total entries: ${totalEntries}`}</p>
      <p>{`Distinct metrics: ${distinctMetrics}`}</p>
      <p>{`Rising: ${rising}`}</p>
      <p>{`Falling: ${falling}`}</p>
      <p>{`Stable: ${stable}`}</p>
    </section>
  )
}
