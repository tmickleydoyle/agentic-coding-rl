'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { products } = useApp()
  const total = products.length
  const lowStock = products.filter((p) => p.onHand < p.reorderAt).length
  const totalValue = products.reduce((acc, p) => acc + p.price * p.onHand, 0)
  const avgPrice =
    total === 0
      ? 0
      : products.reduce((acc, p) => acc + p.price, 0) / total

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total products: ${total}`}</p>
      <p>{`Low stock items: ${lowStock}`}</p>
      <p>{`Total inventory value: $${totalValue.toFixed(2)}`}</p>
      <p>{`Average unit price: $${avgPrice.toFixed(2)}`}</p>
    </section>
  )
}
