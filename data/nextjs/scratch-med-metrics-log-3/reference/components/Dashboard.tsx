'use client'
import { useApp } from '../hooks/useApp'
import { getTrend } from '../lib/trend'

export function Dashboard() {
  const { entries } = useApp()

  const total = entries.length

  // Unique metric names in first-appearance order
  const seenNames: string[] = []
  entries.forEach((e) => {
    if (!seenNames.includes(e.name)) seenNames.push(e.name)
  })
  const unique = seenNames.length

  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total entries: ${total}`}</p>
      <p>{`Unique metrics: ${unique}`}</p>
      <ul>
        {seenNames.map((name) => {
          const forName = entries.filter((e) => e.name === name)
          const latest = forName[forName.length - 1]
          const hasPrev = forName.length >= 2
          const prev = hasPrev ? forName[forName.length - 2] : null
          const trend = hasPrev && prev ? getTrend(latest.value, prev.value) : null
          return (
            <li key={name}>
              {trend !== null
                ? `${name}: ${latest.value} ${trend}`
                : `${name}: ${latest.value}`}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
