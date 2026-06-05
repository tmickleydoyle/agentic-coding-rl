'use client'
import { useApp } from '../hooks/useApp'

export function Dashboard() {
  const { entries } = useApp()

  // Collect distinct metric names in first-appearance order
  const metricOrder: string[] = []
  entries.forEach((e) => {
    if (!metricOrder.includes(e.name)) metricOrder.push(e.name)
  })

  const totalEntries = entries.length
  const totalMetrics = metricOrder.length

  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Metrics tracked: ${totalMetrics}`}</p>
      <p>{`Total entries: ${totalEntries}`}</p>
      <ul>
        {metricOrder.map((metricName) => {
          const metricEntries = entries.filter((e) => e.name === metricName)
          const latest = metricEntries[metricEntries.length - 1].value
          const count = metricEntries.length
          return (
            <li key={metricName}>
              <span>{metricName}</span>
              <span>{latest}</span>
              <span>{`(${count} entries)`}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
