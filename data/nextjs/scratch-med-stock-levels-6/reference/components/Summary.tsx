'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { products } = useApp()
  const totalProducts = products.length
  const totalUnits = products.reduce((acc, p) => acc + p.onHand, 0)
  const lowStockItems = products.filter((p) => p.onHand < p.reorderPoint).length
  const totalValue = products.reduce((acc, p) => acc + p.onHand * p.price, 0)

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total products: ${totalProducts}`}</p>
      <p>{`Total units: ${totalUnits}`}</p>
      <p>{`Low stock items: ${lowStockItems}`}</p>
      <p>{`Total value: $${totalValue.toFixed(2)}`}</p>
    </section>
  )
}
