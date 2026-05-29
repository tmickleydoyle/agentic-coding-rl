'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { CartLine, Product } from './types'

// TODO: implement CartProvider + useCart() returning { lines, add, remove, total, count }.
// add(product) increments qty if present, else appends a line (qty 1) in first-added order.
// remove(productId) decrements qty, dropping the line at qty 0. total = sum(price*qty),
// count = sum(qty). useCart() outside a provider must throw.
type CartApi = {
  lines: CartLine[]
  add: (product: Product) => void
  remove: (productId: string) => void
  total: number
  count: number
}

const CartContext = createContext<CartApi | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  return <CartContext.Provider value={null}>{children}</CartContext.Provider>
}

export function useCart(): CartApi {
  const v = useContext(CartContext)
  if (!v) throw new Error('useCart must be used within a CartProvider')
  return v
}
