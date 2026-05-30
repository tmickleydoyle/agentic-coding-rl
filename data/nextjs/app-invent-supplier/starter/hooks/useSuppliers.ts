'use client'
import { useApp } from '../components/AppStateProvider'
import type { Product, Supplier } from '../lib/types'

export function filterByCategory(_suppliers: Supplier[], _categoryFilter: string): Supplier[] {
  // TODO: 'all' returns all; otherwise filter by category
  return []
}

export function categories(_suppliers: Supplier[]): string[] {
  // TODO: sorted unique categories
  return []
}

export function productsBySupplier(_products: Product[], _supplierId: string): Product[] {
  // TODO: products whose supplierId === supplierId
  return []
}

export function averageLeadTime(_suppliers: Supplier[]): number {
  // TODO: mean lead time rounded to 1 dp (0 when empty)
  return 0
}

export function useSuppliers() {
  const { suppliers, products, categoryFilter } = useApp()
  const filtered = filterByCategory(suppliers, categoryFilter)
  const cats = categories(suppliers)
  const avgLeadTime = averageLeadTime(filtered)
  return { filtered, cats, avgLeadTime, products }
}
