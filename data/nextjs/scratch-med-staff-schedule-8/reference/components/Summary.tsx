'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { shifts } = useApp()

  const totals: Record<string, number> = {}
  shifts.forEach((s) => {
    totals[s.employee] = (totals[s.employee] || 0) + s.hours
  })

  const employees = Object.keys(totals)
  const totalHours = employees.reduce((sum, emp) => sum + totals[emp], 0)

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Employees: ${employees.length}`}</p>
      <ul>
        {employees.map((emp) => (
          <li key={emp}>{`${emp}: ${totals[emp]}h`}</li>
        ))}
      </ul>
      <p>{`Total hours: ${totalHours}h`}</p>
    </section>
  )
}
