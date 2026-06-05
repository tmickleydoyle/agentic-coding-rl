'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product, Route } from '../lib/types'

type Ctx = {
  products: Product[]
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addProduct: (name: string, price: number, onHand: number, reorderPoint: number) => void
  adjustStock: (id: number, delta: number) => void
  removeProduct: (id: number) => void
  resetInventory: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Product[] = [
  { id: 1, name: 'Widget A', price: 2.5, onHand: 100, reorderPoint: 20 },
  { id: 2, name: 'Gadget B', price: 15.0, onHand: 5, reorderPoint: 10 },
  { id: 3, name: 'Doohickey C', price: 7.99, onHand: 0, reorderPoint: 5 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED)
  const [route, setRoute] = useState<Route>('inventory')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(4)

  function addProduct(name: string, price: number, onHand: number, reorderPoint: number) {
    const n = name.trim()
    if (!n) return
    setProducts((p) => [...p, { id: nextId, name: n, price, onHand, reorderPoint }])
    setNextId((i) => i + 1)
  }

  function adjustStock(id: number, delta: number) {
    setProducts((p) =>
      p.map((item) =>
        item.id === id ? { ...item, onHand: Math.max(0, item.onHand + delta) } : item
      )
    )
  }

  function removeProduct(id: number) {
    setProducts((p) => p.filter((item) => item.id !== id))
  }

  function resetInventory() {
    setProducts([])
  }

  const value: Ctx = {
    products,
    route,
    theme,
    navigate: setRoute,
    addProduct,
    adjustStock,
    removeProduct,
    resetInventory,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
