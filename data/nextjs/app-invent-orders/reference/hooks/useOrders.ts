'use client'
import { useOrdersState } from '../components/AppStateProvider'
import type { PurchaseOrder, StatusFilter } from '../lib/types'
import { orderStatus } from '../lib/types'

export type SupplierStat = {
  supplier: string
  orders: number
  outstanding: number
}

export function filterOrders(orders: PurchaseOrder[], statusFilter: StatusFilter): PurchaseOrder[] {
  if (statusFilter === 'all') return orders.slice()
  return orders.filter((o) => orderStatus(o) === statusFilter)
}

export function supplierStats(orders: PurchaseOrder[]): SupplierStat[] {
  const map = new Map<string, SupplierStat>()
  orders.forEach((o) => {
    const existing = map.get(o.supplier) ?? { supplier: o.supplier, orders: 0, outstanding: 0 }
    existing.orders += 1
    if (!o.cancelled) existing.outstanding += Math.max(0, o.ordered - o.received)
    map.set(o.supplier, existing)
  })
  return Array.from(map.values()).sort((a, b) => a.supplier.localeCompare(b.supplier))
}

export function useOrders() {
  const { orders, statusFilter, selectedId } = useOrdersState()
  const filtered = filterOrders(orders, statusFilter)
  const suppliers = supplierStats(orders)
  const selected = orders.find((o) => o.id === selectedId) ?? null
  return { filtered, suppliers, selected }
}
