'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product, Route } from '../lib/types'

type Ctx = {
  products: Product[]
  route: Route
  theme: 'light' | 'dark'
  hideLowStock: boolean
  navigate: (r: Route) => void
  addProduct: (name: string, onHand: number, reorderPoint: number, unitPrice: number) => void
  adjustStock: (id: number, delta: number) => void
  toggleTheme: () => void
  toggleHideLowStock: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Product[] = [
  { id: 1, name: 'Widget A', onHand: 5, reorderPoint: 10, unitPrice: 2.5 },
  { id: 2, name: 'Gadget B', onHand: 20, reorderPoint: 8, unitPrice: 14.99 },
  { id: 3, name: 'Doohickey C', onHand: 3, reorderPoint: 3, unitPrice: 7.0 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED)
  const [route, setRoute] = useState<Route>('inventory')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideLowStock, setHideLowStock] = useState(false)
  const [nextId, setNextId] = useState(4)

  function addProduct(name: string, onHand: number, reorderPoint: number, unitPrice: number) {
    const n = name.trim()
    if (!n) return
    if (onHand < 0 || reorderPoint < 0 || unitPrice < 0) return
    setProducts((p) => [...p, { id: nextId, name: n, onHand, reorderPoint, unitPrice }])
    setNextId((x) => x + 1)
  }

  function adjustStock(id: number, delta: number) {
    setProducts((p) =>
      p.map((product) =>
        product.id === id
          ? { ...product, onHand: Math.max(0, product.onHand + delta) }
          : product,
      ),
    )
  }

  const value: Ctx = {
    products,
    route,
    theme,
    hideLowStock,
    navigate: setRoute,
    addProduct,
    adjustStock,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideLowStock: () => setHideLowStock((h) => !h),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
