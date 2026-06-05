'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product, Route } from '../lib/types'

type Ctx = {
  products: Product[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addProduct: (name: string, onHand: number, reorderPoint: number) => void
  increaseStock: (id: number) => void
  decreaseStock: (id: number) => void
  removeProduct: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Product[] = [
  { id: 1, name: 'Widgets', onHand: 30, reorderPoint: 20 },
  { id: 2, name: 'Sprockets', onHand: 5, reorderPoint: 10 },
  { id: 3, name: 'Bolts', onHand: 100, reorderPoint: 50 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('inventory')
  const [nextId, setNextId] = useState(4)

  function addProduct(name: string, onHand: number, reorderPoint: number) {
    const n = name.trim()
    if (!n) return
    setProducts((p) => [...p, { id: nextId, name: n, onHand, reorderPoint }])
    setNextId((id) => id + 1)
  }

  function increaseStock(id: number) {
    setProducts((p) => p.map((x) => x.id === id ? { ...x, onHand: x.onHand + 1 } : x))
  }

  function decreaseStock(id: number) {
    setProducts((p) => p.map((x) => x.id === id ? { ...x, onHand: Math.max(0, x.onHand - 1) } : x))
  }

  function removeProduct(id: number) {
    setProducts((p) => p.filter((x) => x.id !== id))
  }

  const value: Ctx = {
    products,
    theme,
    route,
    navigate: setRoute,
    addProduct,
    increaseStock,
    decreaseStock,
    removeProduct,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
