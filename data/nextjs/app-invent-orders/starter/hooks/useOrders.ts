'use client'
import { useOrdersState } from '../components/AppStateProvider'
import type { PurchaseOrder } from '../lib/types'

export type SupplierStat = {
  supplier: string
  orders: number
  outstanding: number
}

export function useOrders() {
  // TODO: derive `filtered` (orders after the status filter, by derived status),
  // `suppliers` (per-supplier aggregates sorted by name), and `selected` (or null).
  useOrdersState()
  return {
    filtered: [] as PurchaseOrder[],
    suppliers: [] as SupplierStat[],
    selected: null as PurchaseOrder | null,
  }
}
