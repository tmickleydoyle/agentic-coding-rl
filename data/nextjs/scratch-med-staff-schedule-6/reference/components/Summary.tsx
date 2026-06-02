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

  const totalHours = shifts.reduce((acc, s) => acc + s.hours, 0)

  const employeeOrder: string[] = []
  shifts.forEach((s) => {
    if (!employeeOrder.includes(s.employee)) employeeOrder.push(s.employee)
  })

  const byEmployee: Record<string, number> = {}
  shifts.forEach((s) => {
    byEmployee[s.employee] = (byEmployee[s.employee] || 0) + s.hours
  })

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total shifts: ${shifts.length}`}</p>
      <p>{`Total hours: ${totalHours}h`}</p>
      {employeeOrder.map((name) => (
        <p key={name}>{`${name}: ${byEmployee[name]}h`}</p>
      ))}
    </section>
  )
}
