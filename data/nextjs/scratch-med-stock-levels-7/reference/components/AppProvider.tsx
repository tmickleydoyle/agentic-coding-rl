'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product, Route } from '../lib/types'

const SEED: Product[] = [
  { id: 1, name: 'Widget A', unitPrice: 2.5, onHand: 10, reorderPoint: 5 },
  { id: 2, name: 'Gadget B', unitPrice: 15.0, onHand: 3, reorderPoint: 8 },
  { id: 3, name: 'Doohickey C', unitPrice: 7.25, onHand: 0, reorderPoint: 0 },
]

type Ctx = {
  products: Product[]
  route: Route
  theme: 'light' | 'dark'
  showLowOnly: boolean
  navigate: (r: Route) => void
  addProduct: (name: string, unitPrice: number, onHand: number, reorderPoint: number) => void
  adjustStock: (id: number, delta: number) => void
  toggleShowLowOnly: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED)
  const [route, setRoute] = useState<Route>('inventory')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showLowOnly, setShowLowOnly] = useState(false)
  const [nextId, setNextId] = useState(4)

  function addProduct(name: string, unitPrice: number, onHand: number, reorderPoint: number) {
    const n = name.trim()
    if (!n) return
    if (isNaN(unitPrice) || unitPrice <= 0) return
    if (isNaN(onHand) || onHand < 0 || !Number.isInteger(onHand)) return
    if (isNaN(reorderPoint) || reorderPoint < 0 || !Number.isInteger(reorderPoint)) return
    setProducts((p) => [...p, { id: nextId, name: n, unitPrice, onHand, reorderPoint }])
    setNextId((n) => n + 1)
  }

  function adjustStock(id: number, delta: number) {
    setProducts((ps) =>
      ps.map((p) => {
        if (p.id !== id) return p
        return { ...p, onHand: Math.max(0, p.onHand + delta) }
      }),
    )
  }

  const value: Ctx = {
    products,
    route,
    theme,
    showLowOnly,
    navigate: setRoute,
    addProduct,
    adjustStock,
    toggleShowLowOnly: () => setShowLowOnly((s) => !s),
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
