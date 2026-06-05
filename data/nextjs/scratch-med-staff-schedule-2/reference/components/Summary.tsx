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
    totals[s.employee] = (totals[s.employee] || 0) + s.hours
  })

  const employees = Object.keys(totals)
  const grandTotal = employees.reduce((acc, e) => acc + totals[e], 0)

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      {employees.map((name) => (
        <p key={name}>{`${name}: ${totals[name]}h`}</p>
      ))}
      <p>{`Total employees: ${employees.length}`}</p>
      <p>{`Grand total: ${grandTotal}h`}</p>
    </section>
  )
}
