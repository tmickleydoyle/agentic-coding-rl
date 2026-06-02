'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product, Route } from '../lib/types'

type Ctx = {
  products: Product[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addProduct: (name: string, price: number) => void
  removeProduct: (id: number) => void
  increaseStock: (id: number) => void
  decreaseStock: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Product[] = [
  { id: 1, name: 'Widget A', price: 2.5, onHand: 5, reorderPoint: 10 },
  { id: 2, name: 'Gadget B', price: 15.0, onHand: 12, reorderPoint: 8 },
  { id: 3, name: 'Doohickey C', price: 7.0, onHand: 0, reorderPoint: 5 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('inventory')
  const [nextId, setNextId] = useState(4)

  function addProduct(name: string, price: number) {
    const n = name.trim()
    if (!n || price <= 0) return
    setProducts((ps) => [...ps, { id: nextId, name: n, price, onHand: 0, reorderPoint: 10 }])
    setNextId((x) => x + 1)
  }

  function removeProduct(id: number) {
    setProducts((ps) => ps.filter((p) => p.id !== id))
  }

  function increaseStock(id: number) {
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, onHand: p.onHand + 1 } : p)))
  }

  function decreaseStock(id: number) {
    setProducts((ps) =>
      ps.map((p) => (p.id === id ? { ...p, onHand: Math.max(0, p.onHand - 1) } : p))
    )
  }

  const value: Ctx = {
    products,
    theme,
    route,
    navigate: setRoute,
    addProduct,
    removeProduct,
    increaseStock,
    decreaseStock,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
