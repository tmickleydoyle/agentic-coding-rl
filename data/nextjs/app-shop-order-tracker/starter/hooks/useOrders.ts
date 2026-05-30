'use client'
import { useShop } from '../components/AppStateProvider'
import type { Order } from '../lib/types'

export type OrderCounts = {
  total: number
  placed: number
  shipped: number
  delivered: number
}

export function useOrders() {
  // TODO: derive `filtered` (orders after the status filter), `counts`
  // ({ total, placed, shipped, delivered }), and `selected` (order with selectedId or null).
  useShop()
  return {
    filtered: [] as Order[],
    counts: { total: 0, placed: 0, shipped: 0, delivered: 0 } as OrderCounts,
    selected: null as Order | null,
  }
}
