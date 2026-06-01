'use client'
import { useApp } from '../components/AppStateProvider'
import type { Order, Product } from '../lib/types'

export function computeRevenue(orders: Order[], products: Product[]): number {
  let total = 0
  orders.forEach((o) => {
    if (!o.fulfilled) return
    const product = products.find((p) => p.id === o.productId)
    if (product) total += product.price * o.qty
  })
  return total
}

export function countPending(orders: Order[]): number {
  let pending = 0
  orders.forEach((o) => {
    if (!o.fulfilled) pending += 1
  })
  return pending
}

export function revenuePerProduct(orders: Order[], products: Product[]): Record<string, number> {
  const out: Record<string, number> = {}
  products.forEach((p) => {
    out[p.id] = 0
  })
  orders.forEach((o) => {
    if (!o.fulfilled) return
    const product = products.find((p) => p.id === o.productId)
    if (product) out[o.productId] = (out[o.productId] ?? 0) + product.price * o.qty
  })
  return out
}

export function useSeller() {
  const { orders, products } = useApp()
  const revenue = computeRevenue(orders, products)
  const pending = countPending(orders)
  const revenueByProduct = revenuePerProduct(orders, products)
  return { revenue, pending, revenueByProduct }
}
