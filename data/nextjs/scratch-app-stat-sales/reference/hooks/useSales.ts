'use client'
import { useApp } from '../components/AppStateProvider'
import type { Order, Region } from '../lib/types'
import { MONTHS, REGIONS } from '../lib/types'

export function byProduct(orders: Order[]): { product: string; revenue: number; units: number }[] {
  const map: Record<string, { product: string; revenue: number; units: number }> = {}
  orders.forEach((o) => {
    if (!map[o.product]) map[o.product] = { product: o.product, revenue: 0, units: 0 }
    map[o.product].revenue += o.revenue
    map[o.product].units += o.units
  })
  const rows = Object.keys(map).map((k) => map[k])
  rows.sort((a, b) => {
    if (b.revenue !== a.revenue) return b.revenue - a.revenue
    return a.product < b.product ? -1 : a.product > b.product ? 1 : 0
  })
  return rows
}

export function byRegion(orders: Order[]): { region: Region; revenue: number; units: number }[] {
  return REGIONS.map((region) => {
    let revenue = 0
    let units = 0
    orders.forEach((o) => {
      if (o.region === region) {
        revenue += o.revenue
        units += o.units
      }
    })
    return { region, revenue, units }
  })
}

export function byMonth(orders: Order[]): { month: string; revenue: number }[] {
  return MONTHS.map((month) => {
    let revenue = 0
    orders.forEach((o) => {
      if (o.month === month) revenue += o.revenue
    })
    return { month, revenue }
  })
}

export function totals(orders: Order[]): { totalRevenue: number; totalUnits: number; orderCount: number } {
  let totalRevenue = 0
  let totalUnits = 0
  orders.forEach((o) => {
    totalRevenue += o.revenue
    totalUnits += o.units
  })
  return { totalRevenue, totalUnits, orderCount: orders.length }
}

export function topProduct(orders: Order[]): string {
  const rows = byProduct(orders)
  return rows.length > 0 ? rows[0].product : ''
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
