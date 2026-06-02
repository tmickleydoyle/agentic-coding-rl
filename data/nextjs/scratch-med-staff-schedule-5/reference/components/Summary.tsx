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

  const totalShifts = shifts.length
  const totalHours = shifts.reduce((sum, s) => sum + s.hours, 0)

  const byEmployee: Record<string, number> = {}
  shifts.forEach((s) => {
    byEmployee[s.name] = (byEmployee[s.name] ?? 0) + s.hours
  })
  const sorted = Object.keys(byEmployee).sort()

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total shifts: ${totalShifts}`}</p>
      <p>{`Total hours: ${totalHours}`}</p>
      {sorted.map((emp) => (
        <p key={emp}>{`${emp}: ${byEmployee[emp]} hrs`}</p>
      ))}
    </section>
  )
}
