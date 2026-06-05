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

  // unique employees in insertion order
  const employees: string[] = []
  shifts.forEach((s) => {
    if (!employees.includes(s.employee)) employees.push(s.employee)
  })

  const totals: Record<string, number> = {}
  shifts.forEach((s) => {
    totals[s.employee] = (totals[s.employee] || 0) + s.hours
  })

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total shifts: ${shifts.length}`}</p>
      {employees.map((emp) => (
        <p key={emp}>{`${emp}: ${totals[emp]} hrs`}</p>
      ))}
    </section>
  )
}
