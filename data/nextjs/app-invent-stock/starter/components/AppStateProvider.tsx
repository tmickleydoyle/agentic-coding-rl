'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: StockApi = {
  products: [],
  theme: 'light',
  route: 'products',
  selectedId: null,
  stockFilter: 'all',
  adjust: () => {},
  setReorderPoint: () => {},
  selectProduct: () => {},
  setStockFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold products/theme/route/selectedId/stockFilter in state (seed 3 products),
  // implement adjust/setReorderPoint/selectProduct and the rest, and provide them through
  // StockContext. The STUB below makes the app mount but does nothing.
  return <StockContext.Provider value={STUB}>{children}</StockContext.Provider>
}

export function useStock(): StockApi {
  const v = useContext(StockContext)
  if (!v) throw new Error('useStock must be used within an AppStateProvider')
  return v
}
