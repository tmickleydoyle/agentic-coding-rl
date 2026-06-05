'use client'
import { useApp } from '../hooks/useApp'

const UNIT_PRICE = 2.5

export function Summary() {
  const { products } = useApp()
  const total = products.length
  const lowStock = products.filter((p) => p.onHand < p.reorderPoint).length
  const totalUnits = products.reduce((sum, p) => sum + p.onHand, 0)
  const totalValue = (totalUnits * UNIT_PRICE).toFixed(2)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total products: ${total}`}</p>
      <p>{`Low stock items: ${lowStock}`}</p>
      <p>{`Total units on hand: ${totalUnits}`}</p>
      <p>{`Total inventory value: $${totalValue}`}</p>
    </section>
  )
}
