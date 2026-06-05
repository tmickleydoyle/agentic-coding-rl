'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { services } = useApp()
  const total = services.length
  const active = services.filter((s) => s.active).length
  const inactive = total - active
  const avgAll = total === 0 ? 0 : services.reduce((sum, s) => sum + s.price, 0) / total
  const activeServices = services.filter((s) => s.active)
  const avgActive =
    activeServices.length === 0
      ? 0
      : activeServices.reduce((sum, s) => sum + s.price, 0) / activeServices.length
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total services: ${total}`}</p>
      <p>{`Active: ${active}`}</p>
      <p>{`Inactive: ${inactive}`}</p>
      <p>{`Average price (all): $${avgAll.toFixed(2)}`}</p>
      <p>{`Average price (active): $${avgActive.toFixed(2)}`}</p>
    </section>
  )
}
