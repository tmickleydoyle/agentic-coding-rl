'use client'
import { useStudio } from '../hooks/useStudio'

export function Reports() {
  const { entries, projects } = useStudio()
  const totalHours = entries.reduce((s, e) => s + e.hours, 0)
  const billableHours = entries.filter((e) => e.billable).reduce((s, e) => s + e.hours, 0)
  const totalBillable = projects.reduce((sum, p) => {
    const bh = entries
      .filter((e) => e.project === p.name && e.billable)
      .reduce((s, e) => s + e.hours, 0)
    return sum + bh * p.rate
  }, 0)

  return (
    <section aria-label="Reports view">
      <h1>Reports</h1>
      <p>{`Total hours: ${totalHours} h`}</p>
      <p>{`Billable hours: ${billableHours} h`}</p>
      <p>{`Total billable: $${totalBillable}`}</p>
    </section>
  )
}
