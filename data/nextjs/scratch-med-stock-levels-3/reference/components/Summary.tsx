'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { products } = useApp()
  const total = products.length
  const lowStock = products.filter((p) => p.onHand < p.reorderPoint).length
  const inStock = products.filter((p) => p.onHand >= p.reorderPoint).length
  const totalValue = products.reduce((acc, p) => acc + p.onHand * p.price, 0).toFixed(2)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total products: ${total}`}</p>
      <p>{`Low stock items: ${lowStock}`}</p>
      <p>{`In stock: ${inStock}`}</p>
      <p>{`Total inventory value: $${totalValue}`}</p>
    </section>
  )
}
