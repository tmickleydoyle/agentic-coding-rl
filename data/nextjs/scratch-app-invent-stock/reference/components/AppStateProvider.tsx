'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Product, Route, StockFilter, Theme } from '../lib/types'

type StockApi = {
  products: Product[]
  theme: Theme
  route: Route
  selectedId: string | null
  stockFilter: StockFilter
  adjust: (id: string, delta: number) => void
  setReorderPoint: (id: string, value: number) => void
  selectProduct: (id: string) => void
  setStockFilter: (filter: StockFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const StockContext = createContext<StockApi | null>(null)

const SEED_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Widget', qty: 40, reorderPoint: 10 },
  { id: 'p2', name: 'Gadget', qty: 5, reorderPoint: 8 },
  { id: 'p3', name: 'Sprocket', qty: 0, reorderPoint: 4 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('products')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [stockFilter, setStockFilter] = useState<StockFilter>('all')

  const value = useMemo<StockApi>(() => {
    const adjust = (id: string, delta: number) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, qty: Math.max(0, p.qty + delta) } : p,
        ),
      )
    }

    const setReorderPoint = (id: string, valueIn: number) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, reorderPoint: Math.max(0, valueIn) } : p,
        ),
      )
    }

    const selectProduct = (id: string) => {
      setSelectedId(id)
      setRoute('product-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      products,
      theme,
      route,
      selectedId,
      stockFilter,
      adjust,
      setReorderPoint,
      selectProduct,
      setStockFilter,
      setTheme,
      navigate,
    }
  }, [products, theme, route, selectedId, stockFilter])

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>
}

export function useStock(): StockApi {
  const v = useContext(StockContext)
  if (!v) throw new Error('useStock must be used within an AppStateProvider')
  return v
}
