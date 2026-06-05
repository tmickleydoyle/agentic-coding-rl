'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product, Route } from '../lib/types'
import { SEED_PRODUCTS } from '../lib/seed'

type Ctx = {
  products: Product[]
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addProduct: (name: string, price: number) => void
  removeProduct: (id: number) => void
  adjustStock: (id: number, delta: number) => void
  toggleTheme: () => void
  resetInventory: () => void
}

export const AppContext = createContext<Ctx | null>(null)

function cloneSeeds(): Product[] {
  return SEED_PRODUCTS.map((p) => ({ ...p }))
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(cloneSeeds)
  const [route, setRoute] = useState<Route>('inventory')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(100)

  function addProduct(name: string, price: number) {
    const n = name.trim()
    if (!n || price <= 0) return
    setProducts((prev) => [
      ...prev,
      { id: nextId, name: n, price, onHand: 0, reorderAt: 10 },
    ])
    setNextId((id) => id + 1)
  }

  function removeProduct(id: number) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  function adjustStock(id: number, delta: number) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, onHand: Math.max(0, p.onHand + delta) } : p,
      ),
    )
  }

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }

  function resetInventory() {
    setProducts(cloneSeeds())
  }

  const value: Ctx = {
    products,
    route,
    theme,
    navigate: setRoute,
    addProduct,
    removeProduct,
    adjustStock,
    toggleTheme,
    resetInventory,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
