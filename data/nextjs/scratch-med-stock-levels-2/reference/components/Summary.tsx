'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { products } = useApp()
  const total = products.length
  const lowCount = products.filter((p) => p.onHand < p.reorderPoint).length
  const totalValue = products.reduce((sum, p) => sum + p.onHand * p.unitPrice, 0)
  const avgOnHand = total === 0 ? 0 : products.reduce((sum, p) => sum + p.onHand, 0) / total
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total products: ${total}`}</p>
      <p>{`Low stock items: ${lowCount}`}</p>
      <p>{`Total inventory value: $${totalValue.toFixed(2)}`}</p>
      <p>{`Average on hand: ${avgOnHand.toFixed(1)}`}</p>
    </section>
  )
}
