'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { shifts } = useApp()

  if (shifts.length === 0) {
    return (
      <section aria-label="Summary view">
        <h1>Summary</h1>
        <p>No shifts recorded</p>
      </section>
    )
  }

  const totals: Record<string, number> = {}
  shifts.forEach((s) => {
    totals[s.name] = (totals[s.name] || 0) + s.hours
  })

  const sorted = Object.keys(totals).sort()
  const grand = shifts.reduce((acc, s) => acc + s.hours, 0)

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      {sorted.map((emp) => (
        <p key={emp}>{`${emp}: ${totals[emp]}h`}</p>
      ))}
      <p>{`Grand total: ${grand}h`}</p>
    </section>
  )
}
