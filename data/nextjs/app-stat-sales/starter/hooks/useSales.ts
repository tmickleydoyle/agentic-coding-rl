'use client'
import { useApp } from '../components/AppStateProvider'
import type { Order, Region } from '../lib/types'

export function byProduct(_orders: Order[]): { product: string; revenue: number; units: number }[] {
  // TODO: sum revenue + units per product, sorted by revenue descending
  return []
}

export function byRegion(_orders: Order[]): { region: Region; revenue: number; units: number }[] {
  // TODO: sum revenue + units per region in ['NA','EU','APAC'] order (include zeros)
  return []
}

export function byMonth(_orders: Order[]): { month: string; revenue: number }[] {
  // TODO: sum revenue per month in ['Jan','Feb','Mar'] order (include zeros)
  return []
}

export function totals(_orders: Order[]): { totalRevenue: number; totalUnits: number; orderCount: number } {
  // TODO: sum revenue + units and count orders
  return { totalRevenue: 0, totalUnits: 0, orderCount: 0 }
}

export function topProduct(_orders: Order[]): string {
  // TODO: the product with the highest revenue, or '' when empty
  return ''
}

export function useSales() {
  const { orders, regionFilter } = useApp()
  const filtered = regionFilter === 'all' ? orders : orders.filter((o) => o.region === regionFilter)
  return {
    orders: filtered,
    byProduct: byProduct(filtered),
    byRegion: byRegion(filtered),
    byMonth: byMonth(filtered),
    totals: totals(filtered),
    topProduct: topProduct(filtered),
  }
}
