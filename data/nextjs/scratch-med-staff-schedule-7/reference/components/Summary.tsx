'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { shifts } = useApp()
  const totalShifts = shifts.length
  const totalHours = shifts.reduce((sum, s) => sum + s.hours, 0)

  const byEmployee: Record<string, number> = {}
  shifts.forEach((s) => {
    byEmployee[s.employee] = (byEmployee[s.employee] || 0) + s.hours
  })

  const employees = Object.keys(byEmployee)

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <ul>
        {employees.map((emp) => (
          <li key={emp}>{`${emp}: ${byEmployee[emp]}h`}</li>
        ))}
      </ul>
      <p>{`Total shifts: ${totalShifts}`}</p>
      <p>{`Total hours: ${totalHours}h`}</p>
    </section>
  )
}
