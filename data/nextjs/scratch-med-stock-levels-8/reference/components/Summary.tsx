'use client'
import { useApp } from '../hooks/useApp'
import type { Product } from '../lib/types'

function isLow(p: Product) {
  return p.onHand < p.reorderPoint
}

export function Summary() {
  const { products } = useApp()
  const total = products.length
  const lowCount = products.filter(isLow).length
  const totalValue = products.reduce((acc, p) => acc + p.onHand * p.unitPrice, 0)
  const pct = total === 0 ? 0 : Math.round((lowCount / total) * 100)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total products: ${total}`}</p>
      <p>{`Low stock items: ${lowCount}`}</p>
      <p>{`Total inventory value: $${totalValue.toFixed(2)}`}</p>
      <p>{`Low stock: ${pct}%`}</p>
    </section>
  )
}
