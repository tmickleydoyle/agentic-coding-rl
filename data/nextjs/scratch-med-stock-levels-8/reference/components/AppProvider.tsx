'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product, Route } from '../lib/types'
import { SEED } from '../lib/seed'

type Ctx = {
  products: Product[]
  route: Route
  theme: 'light' | 'dark'
  showLowOnly: boolean
  navigate: (r: Route) => void
  addProduct: (name: string, onHand: number, reorderPoint: number, unitPrice: number) => void
  adjustProduct: (id: number, delta: number) => void
  removeProduct: (id: number) => void
  toggleTheme: () => void
  toggleShowLowOnly: () => void
  resetInventory: () => void
}

export const AppContext = createContext<Ctx | null>(null)

function freshSeed(): Product[] {
  return SEED.map((s, i) => ({ ...s, id: i + 1 }))
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(freshSeed)
  const [route, setRoute] = useState<Route>('inventory')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showLowOnly, setShowLowOnly] = useState(false)
  const [nextId, setNextId] = useState(SEED.length + 1)

  function addProduct(name: string, onHand: number, reorderPoint: number, unitPrice: number) {
    const n = name.trim()
    if (!n) return
    if (!Number.isFinite(onHand) || onHand < 0) return
    if (!Number.isFinite(reorderPoint) || reorderPoint < 0) return
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) return
    setProducts((p) => [...p, { id: nextId, name: n, onHand, reorderPoint, unitPrice }])
    setNextId((n) => n + 1)
  }

  function adjustProduct(id: number, delta: number) {
    setProducts((p) =>
      p.map((item) =>
        item.id === id ? { ...item, onHand: Math.max(0, item.onHand + delta) } : item,
      ),
    )
  }

  function removeProduct(id: number) {
    setProducts((p) => p.filter((item) => item.id !== id))
  }

  function resetInventory() {
    setProducts(freshSeed())
    setNextId(SEED.length + 1)
  }

  const value: Ctx = {
    products,
    route,
    theme,
    showLowOnly,
    navigate: setRoute,
    addProduct,
    adjustProduct,
    removeProduct,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleShowLowOnly: () => setShowLowOnly((s) => !s),
    resetInventory,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
