export type OrderStatus = 'open' | 'partial' | 'received' | 'cancelled'

export type PurchaseOrder = {
  id: string
  supplier: string
  item: string
  ordered: number
  received: number
  cancelled: boolean
}

export type StatusFilter = 'all' | OrderStatus

export type Route = 'orders' | 'order-detail' | 'new' | 'suppliers'
export type Theme = 'light' | 'dark'

export function orderStatus(o: PurchaseOrder): OrderStatus {
  if (o.cancelled) return 'cancelled'
  if (o.received >= o.ordered) return 'received'
  if (o.received > 0) return 'partial'
  return 'open'
}

export function outstanding(o: PurchaseOrder): number {
  return Math.max(0, o.ordered - o.received)
}
