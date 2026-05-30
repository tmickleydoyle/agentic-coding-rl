'use client'
import type { Order } from '../lib/types'

export default function OrderRow({
  order,
  onView,
}: {
  order: Order
  onView: (id: string) => void
}) {
  return (
    <li data-testid={`order-${order.id}`} data-status={order.status}>
      <span data-testid={`order-${order.id}-item`}>{order.item}</span>
      <span data-testid={`order-${order.id}-total`}>{order.total}</span>
      <span data-testid={`order-${order.id}-status`}>{order.status}</span>
      <button data-testid={`view-${order.id}`} onClick={() => onView(order.id)}>
        View
      </button>
    </li>
  )
}
