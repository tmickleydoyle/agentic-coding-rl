export type OrderStatus = 'placed' | 'shipped' | 'delivered'

export type Order = {
  id: string
  item: string
  total: number
  status: OrderStatus
}

export type StatusFilter = 'all' | OrderStatus

export type Route = 'orders' | 'order-detail' | 'track' | 'account'
export type Theme = 'light' | 'dark'

export const TIMELINE: OrderStatus[] = ['placed', 'shipped', 'delivered']
