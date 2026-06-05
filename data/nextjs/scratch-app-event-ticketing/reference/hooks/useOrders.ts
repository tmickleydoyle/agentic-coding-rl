'use client'
import { useApp } from '../components/AppStateProvider'
import type { Order } from '../lib/types'

export function sumQty(orders: Order[]): number {
  return orders.reduce((acc, o) => acc + o.qty, 0)
}

export function sumTotal(orders: Order[]): number {
  return orders.reduce((acc, o) => acc + o.total, 0)
}

export function useOrders() {
  const { orders } = useApp()

  const ordersForEvent = (eventId: string): Order[] =>
    orders.filter((o) => o.eventId === eventId)

  const ticketCount = sumQty(orders)
  const revenue = sumTotal(orders)

  return { ordersForEvent, ticketCount, revenue }
}
