'use client'
import { useApp } from '../hooks/useApp'

function avg(prices: number[]): string {
  if (prices.length === 0) return '$0.00'
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length
  return `$${mean.toFixed(2)}`
}

export function Summary() {
  const { services } = useApp()
  const total = services.length
  const active = services.filter(s => s.active)
  const inactive = services.filter(s => !s.active)
  const allPrices = services.map(s => s.price)
  const activePrices = active.map(s => s.price)

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total services: ${total}`}</p>
      <p>{`Active services: ${active.length}`}</p>
      <p>{`Inactive services: ${inactive.length}`}</p>
      <p>{`Average price: ${avg(allPrices)}`}</p>
      <p>{`Active average: ${avg(activePrices)}`}</p>
    </section>
  )
}
