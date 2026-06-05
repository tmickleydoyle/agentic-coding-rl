'use client'
import { useSalon } from '../hooks/useSalon'

export function Reports() {
  const { appts } = useSalon()
  const total = appts.length
  const completed = appts.filter((a) => a.status === 'completed').length
  const cancelled = appts.filter((a) => a.status === 'cancelled').length
  const revenue = appts
    .filter((a) => a.status === 'completed')
    .reduce((s, a) => s + a.price, 0)
  const cancelRate = total === 0 ? 0 : Math.round((cancelled / total) * 100)
  return (
    <section aria-label="Reports view">
      <h1>Reports</h1>
      <p>{`Total appointments: ${total}`}</p>
      <p>{`Completed: ${completed}`}</p>
      <p>{`Cancelled: ${cancelled}`}</p>
      <p>{`Total revenue: $${revenue}`}</p>
      <p>{`Cancellation rate: ${cancelRate}%`}</p>
    </section>
  )
}
