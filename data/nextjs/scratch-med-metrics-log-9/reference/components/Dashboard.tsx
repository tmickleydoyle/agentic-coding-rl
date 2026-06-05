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

  const total = entries.length

  const latestByName: Record<string, number> = {}
  entries.forEach((e) => {
    latestByName[e.name] = e.value
  })

  const uniqueNames = Object.keys(latestByName).sort()
  const unique = uniqueNames.length

  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total entries: ${total}`}</p>
      <p>{`Unique metrics: ${unique}`}</p>
      {uniqueNames.map((name) => (
        <p key={name}>{`${name}: ${latestByName[name]}`}</p>
      ))}
    </section>
  )
}
