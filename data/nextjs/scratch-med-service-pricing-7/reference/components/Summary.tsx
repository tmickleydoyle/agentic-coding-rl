'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { services } = useApp()
  const total = services.length
  const active = services.filter((s) => s.active)
  const inactive = total - active.length
  const avg = total === 0 ? 0 : services.reduce((a, s) => a + s.price, 0) / total
  const activeAvg = active.length === 0 ? 0 : active.reduce((a, s) => a + s.price, 0) / active.length
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total services: ${total}`}</p>
      <p>{`Active: ${active.length}`}</p>
      <p>{`Inactive: ${inactive}`}</p>
      <p>{`Average price: $${avg.toFixed(2)}`}</p>
      <p>{`Active avg: $${activeAvg.toFixed(2)}`}</p>
    </section>
  )
}
