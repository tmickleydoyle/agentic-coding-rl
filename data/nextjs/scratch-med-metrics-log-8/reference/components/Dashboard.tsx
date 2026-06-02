'use client'
import { useApp } from '../hooks/useApp'

export function Dashboard() {
  const { entries } = useApp()

  if (entries.length === 0) {
    return (
      <section aria-label="Dashboard view">
        <h1>Dashboard</h1>
        <p>No metrics logged yet.</p>
      </section>
    )
  }

  // collect unique metric names in order of first appearance
  const seen: string[] = []
  entries.forEach((e) => {
    if (!seen.includes(e.name)) seen.push(e.name)
  })

  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      {seen.map((metricName) => {
        const group = entries.filter((e) => e.name === metricName)
        const latest = group[group.length - 1]
        const prev = group.length >= 2 ? group[group.length - 2] : null
        let trend = 'flat'
        if (prev !== null) {
          if (latest.value > prev.value) trend = 'up'
          else if (latest.value < prev.value) trend = 'down'
          else trend = 'flat'
        }
        return (
          <section key={metricName} aria-label={`Metric ${metricName}`}>
            <h2>{metricName}</h2>
            <p>{`Latest: ${latest.value.toFixed(2)}`}</p>
            <p>{`Trend: ${trend}`}</p>
            <p>{`Count: ${group.length}`}</p>
          </section>
        )
      })}
    </section>
  )
}
