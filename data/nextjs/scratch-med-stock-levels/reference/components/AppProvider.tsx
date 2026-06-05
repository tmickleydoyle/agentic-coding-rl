'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product, Route } from '../lib/types'

type Ctx = {
  products: Product[]
  route: Route
  theme: 'light' | 'dark'
  showLowStockOnly: boolean
  navigate: (r: Route) => void
  addProduct: (name: string, price: number) => void
  increase: (id: number) => void
  decrease: (id: number) => void
  setReorder: (id: number, point: number) => void
  toggleTheme: () => void
  toggleShowLowStockOnly: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Product[] = [
  { id: 1, name: 'Widget A', price: 4.99, onHand: 5, reorderPoint: 10 },
  { id: 2, name: 'Widget B', price: 12.50, onHand: 20, reorderPoint: 8 },
  { id: 3, name: 'Gadget C', price: 7.25, onHand: 0, reorderPoint: 5 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED)
  const [route, setRoute] = useState<Route>('inventory')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showLowStockOnly, setShowLowStockOnly] = useState(false)
  const [nextId, setNextId] = useState(4)

  function addProduct(name: string, price: number) {
    const n = name.trim()
    if (!n || !isFinite(price) || price <= 0) return
    setProducts((p) => [...p, { id: nextId, name: n, price, onHand: 0, reorderPoint: 10 }])
    setNextId((x) => x + 1)
  }

  function increase(id: number) {
    setProducts((p) => p.map((x) => x.id === id ? { ...x, onHand: x.onHand + 1 } : x))
  }

  function decrease(id: number) {
    setProducts((p) => p.map((x) => x.id === id ? { ...x, onHand: Math.max(0, x.onHand - 1) } : x))
  }

  function setReorder(id: number, point: number) {
    if (!isFinite(point) || point < 0 || !Number.isInteger(point)) return
    setProducts((p) => p.map((x) => x.id === id ? { ...x, reorderPoint: point } : x))
  }

  const value: Ctx = {
    products,
    route,
    theme,
    showLowStockOnly,
    navigate: setRoute,
    addProduct,
    increase,
    decrease,
    setReorder,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleShowLowStockOnly: () => setShowLowStockOnly((s) => !s),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
