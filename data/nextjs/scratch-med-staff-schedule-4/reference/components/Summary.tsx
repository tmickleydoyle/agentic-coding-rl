'use client'
import { useApp } from '../hooks/useApp'
import { formatHours } from '../lib/format'

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

  const order: string[] = []
  const totals: Record<string, number> = {}
  shifts.forEach((s) => {
    if (!order.includes(s.employee)) order.push(s.employee)
    totals[s.employee] = (totals[s.employee] || 0) + s.hours
  })

  const grand = order.reduce((sum, emp) => sum + totals[emp], 0)

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <ul>
        {order.map((emp) => (
          <li key={emp}>{`${emp}: ${formatHours(totals[emp])}`}</li>
        ))}
      </ul>
      <p>{`Grand total: ${formatHours(grand)}`}</p>
    </section>
  )
}
