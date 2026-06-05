'use client'
import { useStudio } from '../hooks/useStudio'
import { bucketOf } from '../lib/types'

export function Reports() {
  const { invoices } = useStudio()
  const unpaid = invoices.filter((iv) => !iv.paid)
  let current = 0
  let overdue = 0
  let critical = 0
  unpaid.forEach((iv) => {
    const b = bucketOf(iv.daysOld)
    if (b === 'current') current += iv.amount
    else if (b === 'overdue') overdue += iv.amount
    else critical += iv.amount
  })
  const total = current + overdue + critical

  return (
    <section aria-label="Reports view">
      <h1>Reports</h1>
      <p>{`Current (0-30): $${current}`}</p>
      <p>{`Overdue (31-60): $${overdue}`}</p>
      <p>{`Critical (61+): $${critical}`}</p>
      <p>{`Total outstanding: $${total}`}</p>
    </section>
  )
}
