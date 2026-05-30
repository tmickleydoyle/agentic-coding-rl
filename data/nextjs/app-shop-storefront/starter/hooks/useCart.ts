'use client'
import { useShop } from '../components/AppStateProvider'
import type { Product } from '../lib/types'

export type JoinedLine = {
  productId: string
  name: string
  price: number
  qty: number
  subtotal: number
}

export function useCart() {
  // TODO: join cart lines to products (with subtotal = price*qty), compute count, subtotal,
  // tax (10%), total, and `visible` (products after category + maxPrice filters).
  useShop()
  return {
    lines: [] as JoinedLine[],
    count: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    visible: [] as Product[],
  }
}
