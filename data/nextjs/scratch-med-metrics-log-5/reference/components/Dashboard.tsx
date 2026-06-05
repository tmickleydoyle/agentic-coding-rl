'use client'
import { useApp } from '../hooks/useApp'
import { getTrend } from '../lib/trend'

export function Dashboard() {
  const { entries } = useApp()

  if (entries.length === 0) {
    return (
      <section aria-label="Dashboard view">
        <h1>Dashboard</h1>
        <p>No metrics logged yet</p>
      </section>
    )
  }

  // Collect unique names in insertion order
  const namesSeen: string[] = []
  entries.forEach((e) => {
    if (!namesSeen.includes(e.name)) namesSeen.push(e.name)
  })

  const totalEntries = entries.length
  const trackedCount = namesSeen.length

  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Tracked metrics: ${trackedCount}`}</p>
      <p>{`Total entries: ${totalEntries}`}</p>
      <ul>
        {namesSeen.map((name) => {
          const forMetric = entries.filter((e) => e.name === name)
          const latest = forMetric[forMetric.length - 1]
          const prev = forMetric.length > 1 ? forMetric[forMetric.length - 2] : null
          const trend = getTrend(prev ? prev.value : null, latest.value)
          return (
            <li key={name}>
              <span>{name}</span>
              <span>{latest.value}</span>
              <span>{trend}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
