'use client'
import type { PurchaseOrder } from '../lib/types'

export default function OrderRow(_props: {
  order: PurchaseOrder
  onView: (id: string) => void
}) {
  // TODO: render supplier, item, progress (received/ordered), outstanding, and a view-<id>
  // button; data-status (derived) on the <li>.
  return <li data-testid={`order-${_props.order.id}`} data-status="open" />
}
