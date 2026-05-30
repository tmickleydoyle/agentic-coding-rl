'use client'
import { useStock } from '../components/AppStateProvider'
import type { Product } from '../lib/types'

export type StockStats = {
  total: number
  low: number
  ok: number
  units: number
}

export function useProducts() {
  // TODO: derive `filtered` (products after the stock filter), `stats`
  // ({ total, low, ok, units }), `lowProducts`, and `selected` (or null).
  useStock()
  return {
    filtered: [] as Product[],
    stats: { total: 0, low: 0, ok: 0, units: 0 } as StockStats,
    lowProducts: [] as Product[],
    selected: null as Product | null,
  }
}
