'use client'
import { useStock } from '../components/AppStateProvider'
import type { Product, StockFilter } from '../lib/types'
import { isLow } from '../lib/types'

export type StockStats = {
  total: number
  low: number
  ok: number
  units: number
}

export function filterProducts(products: Product[], stockFilter: StockFilter): Product[] {
  if (stockFilter === 'low') return products.filter((p) => isLow(p))
  if (stockFilter === 'ok') return products.filter((p) => !isLow(p))
  return products.slice()
}

export function computeStats(products: Product[]): StockStats {
  const stats: StockStats = { total: products.length, low: 0, ok: 0, units: 0 }
  products.forEach((p) => {
    stats.units += p.qty
    if (isLow(p)) stats.low += 1
    else stats.ok += 1
  })
  return stats
}

export function useProducts() {
  const { products, stockFilter, selectedId } = useStock()
  const filtered = filterProducts(products, stockFilter)
  const stats = computeStats(products)
  const lowProducts = products.filter((p) => isLow(p))
  const selected = products.find((p) => p.id === selectedId) ?? null
  return { filtered, stats, lowProducts, selected }
}
