'use client'
import { useApp } from '../components/AppStateProvider'
import type { Product, Supplier } from '../lib/types'

export function filterByCategory(suppliers: Supplier[], categoryFilter: string): Supplier[] {
  if (categoryFilter === 'all') return suppliers.slice()
  return suppliers.filter((s) => s.category === categoryFilter)
}

export function categories(suppliers: Supplier[]): string[] {
  const set: Record<string, true> = {}
  suppliers.forEach((s) => {
    set[s.category] = true
  })
  return Object.keys(set).sort()
}

export function productsBySupplier(products: Product[], supplierId: string): Product[] {
  return products.filter((p) => p.supplierId === supplierId)
}

export function averageLeadTime(suppliers: Supplier[]): number {
  if (suppliers.length === 0) return 0
  let total = 0
  suppliers.forEach((s) => {
    total += s.leadTimeDays
  })
  return Math.round((total / suppliers.length) * 10) / 10
}

export function useSuppliers() {
  const { suppliers, products, categoryFilter } = useApp()
  const filtered = filterByCategory(suppliers, categoryFilter)
  const cats = categories(suppliers)
  const avgLeadTime = averageLeadTime(filtered)
  return { filtered, cats, avgLeadTime, products }
}
