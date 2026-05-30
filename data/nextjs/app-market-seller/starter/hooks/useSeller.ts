'use client'
import { useApp } from '../components/AppStateProvider'
import type { Order, Product } from '../lib/types'

export function computeRevenue(_orders: Order[], _products: Product[]): number {
  // TODO: sum qty * product.price over fulfilled orders
  return 0
}

export function countPending(_orders: Order[]): number {
  // TODO: count unfulfilled orders
  return 0
}

export function revenuePerProduct(_orders: Order[], _products: Product[]): Record<string, number> {
  // TODO: per-product fulfilled revenue
  return {}
}

export function useSeller() {
  const { orders, products } = useApp()
  const revenue = computeRevenue(orders, products)
  const pending = countPending(orders)
  const revenueByProduct = revenuePerProduct(orders, products)
  return { revenue, pending, revenueByProduct }
}
