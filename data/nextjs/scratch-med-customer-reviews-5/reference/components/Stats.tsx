'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { reviews } = useApp()
  const total = reviews.length
  const responded = reviews.filter((r) => r.responded).length
  const unresponded = total - responded
  const avg = total === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / total
  const avgStr = avg.toFixed(1)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total reviews: ${total}`}</p>
      <p>{`Responded: ${responded}`}</p>
      <p>{`Unresponded: ${unresponded}`}</p>
      <p>{`Average rating: ${avgStr}`}</p>
    </section>
  )
}
