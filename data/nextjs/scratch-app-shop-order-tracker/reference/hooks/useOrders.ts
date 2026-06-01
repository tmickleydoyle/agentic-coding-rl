'use client'
import { useShop } from '../components/AppStateProvider'
import type { Order, OrderStatus, StatusFilter } from '../lib/types'
import { TIMELINE } from '../lib/types'

export type OrderCounts = {
  total: number
  placed: number
  shipped: number
  delivered: number
}

export function statusIndex(status: OrderStatus): number {
  return TIMELINE.indexOf(status)
}

export function reached(order: Order, status: OrderStatus): boolean {
  return statusIndex(order.status) >= statusIndex(status)
}

export function filterOrders(orders: Order[], statusFilter: StatusFilter): Order[] {
  if (statusFilter === 'all') return orders.slice()
  return orders.filter((o) => o.status === statusFilter)
}

export function countOrders(orders: Order[]): OrderCounts {
  const counts: OrderCounts = { total: orders.length, placed: 0, shipped: 0, delivered: 0 }
  orders.forEach((o) => {
    counts[o.status] += 1
  })
  return counts
}

export function useOrders() {
  const { orders, statusFilter, selectedId } = useShop()
  const filtered = filterOrders(orders, statusFilter)
  const counts = countOrders(orders)
  const selected = orders.find((o) => o.id === selectedId) ?? null
  return { filtered, counts, selected }
}
