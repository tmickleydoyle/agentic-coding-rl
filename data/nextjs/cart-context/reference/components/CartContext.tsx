'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { CartLine, Product } from './types'

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

  const add = (product: Product) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.product.id === product.id)
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id ? { ...l, qty: l.qty + 1 } : l
        )
      }
      return [...prev, { product, qty: 1 }]
    })
  }

  const remove = (productId: string) => {
    setLines((prev) =>
      prev
        .map((l) => (l.product.id === productId ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0)
    )
  }

  const total = useMemo(
    () => lines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
    [lines]
  )
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines])

  return (
    <CartContext.Provider value={{ lines, add, remove, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartApi {
  const v = useContext(CartContext)
  if (!v) throw new Error('useCart must be used within a CartProvider')
  return v
}
