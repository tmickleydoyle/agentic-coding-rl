'use client'
import { useApp } from '../hooks/useApp'

function fmt(n: number): string {
  return `$${n.toFixed(2)}`
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

export function Stats() {
  const { services } = useApp()
  const active = services.filter((s) => s.active)
  const inactive = services.filter((s) => !s.active)
  const allPrices = services.map((s) => s.price)
  const activePrices = active.map((s) => s.price)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total services: ${services.length}`}</p>
      <p>{`Active services: ${active.length}`}</p>
      <p>{`Inactive services: ${inactive.length}`}</p>
      <p>{`Average price (all): ${fmt(avg(allPrices))}`}</p>
      <p>{`Average price (active): ${fmt(avg(activePrices))}`}</p>
    </section>
  )
}
