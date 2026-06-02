'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { shifts } = useApp()

  const totals: Record<string, number> = {}
  shifts.forEach((s) => {
    totals[s.name] = (totals[s.name] || 0) + s.hours
  })

  const names = Object.keys(totals)
  const totalHours = shifts.reduce((acc, s) => acc + s.hours, 0)

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <ul>
        {names.map((n) => (
          <li key={n}>{`${n}: ${totals[n]} hrs`}</li>
        ))}
      </ul>
      <p>{`Total hours: ${totalHours}`}</p>
      <p>{`Employees: ${names.length}`}</p>
    </section>
  )
}
