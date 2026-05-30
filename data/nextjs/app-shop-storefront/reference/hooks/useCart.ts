'use client'
import { useShop } from '../components/AppStateProvider'
import type { CartLine, CategoryFilter, Product } from '../lib/types'

export type JoinedLine = {
  productId: string
  name: string
  price: number
  qty: number
  subtotal: number
}

export function cartCount(cart: CartLine[]): number {
  return cart.reduce((sum, l) => sum + l.qty, 0)
}

export function cartSubtotal(cart: CartLine[], products: Product[]): number {
  return cart.reduce((sum, l) => {
    const p = products.find((x) => x.id === l.productId)
    return sum + (p ? p.price * l.qty : 0)
  }, 0)
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function filterProducts(
  products: Product[],
  categoryFilter: CategoryFilter,
  maxPrice: number | null,
): Product[] {
  return products.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
    if (maxPrice !== null && p.price > maxPrice) return false
    return true
  })
}

export function useCart() {
  const { cart, products, categoryFilter, maxPrice } = useShop()
  const lines: JoinedLine[] = []
  cart.forEach((l) => {
    const p = products.find((x) => x.id === l.productId)
    if (p) {
      lines.push({
        productId: p.id,
        name: p.name,
        price: p.price,
        qty: l.qty,
        subtotal: round2(p.price * l.qty),
      })
    }
  })
  const count = cartCount(cart)
  const subtotal = round2(cartSubtotal(cart, products))
  const tax = round2(subtotal * 0.1)
  const total = round2(subtotal + tax)
  const visible = filterProducts(products, categoryFilter, maxPrice)
  return { lines, count, subtotal, tax, total, visible }
}
