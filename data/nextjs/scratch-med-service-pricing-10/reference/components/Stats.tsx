'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { services } = useApp()
  const total = services.length
  const active = services.filter((s) => s.active)
  const inactive = services.filter((s) => !s.active)

  const avgAll = total === 0 ? 0 : services.reduce((sum, s) => sum + s.price, 0) / total
  const avgActive = active.length === 0 ? 0 : active.reduce((sum, s) => sum + s.price, 0) / active.length

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total services: ${total}`}</p>
      <p>{`Active services: ${active.length}`}</p>
      <p>{`Inactive services: ${inactive.length}`}</p>
      <p>{`Average price (all): $${avgAll.toFixed(2)}`}</p>
      <p>{`Average price (active): $${avgActive.toFixed(2)}`}</p>
    </section>
  )
}
