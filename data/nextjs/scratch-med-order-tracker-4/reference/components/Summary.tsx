'use client'
import { useApp } from '../hooks/useApp'
import type { OrderStatus } from '../lib/types'

export function Summary() {
  const { orders } = useApp()
  const total = orders.length
  const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length
  const pct = total === 0 ? 0 : Math.round((count('delivered') / total) * 100)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total orders: ${total}`}</p>
      <p>{`New: ${count('new')}`}</p>
      <p>{`Packing: ${count('packing')}`}</p>
      <p>{`Shipped: ${count('shipped')}`}</p>
      <p>{`Delivered: ${count('delivered')}`}</p>
      <p>{`Completion: ${pct}%`}</p>
    </section>
  )
}
