'use client'
import type { PurchaseOrder } from '../lib/types'
import { orderStatus, outstanding } from '../lib/types'

export default function OrderRow({
  order,
  onView,
}: {
  order: PurchaseOrder
  onView: (id: string) => void
}) {
  return (
    <li data-testid={`order-${order.id}`} data-status={orderStatus(order)}>
      <span data-testid={`order-${order.id}-supplier`}>{order.supplier}</span>
      <span data-testid={`order-${order.id}-item`}>{order.item}</span>
      <span data-testid={`order-${order.id}-progress`}>
        {order.received}/{order.ordered}
      </span>
      <span data-testid={`order-${order.id}-outstanding`}>{outstanding(order)}</span>
      <button data-testid={`view-${order.id}`} onClick={() => onView(order.id)}>
        View
      </button>
    </li>
  )
}
