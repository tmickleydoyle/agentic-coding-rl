'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { services } = useApp()
  const total = services.length
  const activeServices = services.filter((s) => s.active)
  const inactiveCount = services.filter((s) => !s.active).length
  const activeCount = activeServices.length

  const avgAll = total === 0 ? 0 : services.reduce((sum, s) => sum + s.price, 0) / total
  const avgActive = activeCount === 0 ? 0 : activeServices.reduce((sum, s) => sum + s.price, 0) / activeCount

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total services: ${total}`}</p>
      <p>{`Active services: ${activeCount}`}</p>
      <p>{`Inactive services: ${inactiveCount}`}</p>
      <p>{`Average price: $${avgAll.toFixed(2)}`}</p>
      <p>{`Active average: $${avgActive.toFixed(2)}`}</p>
    </section>
  )
}
