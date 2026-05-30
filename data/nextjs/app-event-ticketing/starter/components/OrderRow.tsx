'use client'
import type { Order } from '../lib/types'

export default function OrderRow({
  order,
  eventName,
  tierName,
}: {
  order: Order
  eventName: string
  tierName: string
}) {
  return (
    <li data-testid={`order-${order.id}`}>
      <span data-testid={`order-${order.id}-event`}>{eventName}</span>
      <span data-testid={`order-${order.id}-tier`}>{tierName}</span>
      <span data-testid={`order-${order.id}-qty`}>{order.qty}</span>
      <span data-testid={`order-${order.id}-buyer`}>{order.buyer}</span>
      <span data-testid={`order-${order.id}-total`}>{order.total}</span>
    </li>
  )
}
