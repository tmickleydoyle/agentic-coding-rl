'use client'
import type { Order } from '../lib/types'

export default function OrderRow(_props: { order: Order; onView: (id: string) => void }) {
  // TODO: render the item, total, status, and a view-<id> button; data-status on the <li>.
  return <li data-testid={`order-${_props.order.id}`} data-status={_props.order.status} />
}
