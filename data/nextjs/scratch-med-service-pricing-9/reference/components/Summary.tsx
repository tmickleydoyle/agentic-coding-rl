'use client'
import { useApp } from '../hooks/useApp'

function fmt(price: number) {
  return `$${price.toFixed(2)}`
}

export function Summary() {
  const { services } = useApp()
  const total = services.length
  const activeList = services.filter((s) => s.active)
  const inactiveCount = services.filter((s) => !s.active).length
  const avgAll = total === 0 ? 0 : services.reduce((sum, s) => sum + s.price, 0) / total
  const avgActive = activeList.length === 0 ? 0 : activeList.reduce((sum, s) => sum + s.price, 0) / activeList.length
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total services: ${total}`}</p>
      <p>{`Active: ${activeList.length}`}</p>
      <p>{`Inactive: ${inactiveCount}`}</p>
      <p>{`Average price: ${fmt(avgAll)}`}</p>
      <p>{`Active average: ${fmt(avgActive)}`}</p>
    </section>
  )
}
