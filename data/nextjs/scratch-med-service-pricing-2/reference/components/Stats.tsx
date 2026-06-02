'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { services } = useApp()
  const total = services.length
  const active = services.filter((s) => s.active).length
  const inactive = total - active
  const avgPrice = total === 0
    ? 0
    : services.reduce((sum, s) => sum + s.price, 0) / total
  const activePct = total === 0 ? 0 : Math.round((active / total) * 100)

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total services: ${total}`}</p>
      <p>{`Active: ${active}`}</p>
      <p>{`Inactive: ${inactive}`}</p>
      <p>{`Average price: $${avgPrice.toFixed(2)}`}</p>
      <p>{`Active %: ${activePct}%`}</p>
    </section>
  )
}
