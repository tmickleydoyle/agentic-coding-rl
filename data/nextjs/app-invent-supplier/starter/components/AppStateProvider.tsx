'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Product, Route, Supplier, Theme } from '../lib/types'

type NewSupplierInput = {
  name: string
  category: string
  leadTimeDays: number
  rating?: number
}

type AppApi = {
  suppliers: Supplier[]
  products: Product[]
  theme: Theme
  route: Route
  categoryFilter: string
  selectedId: string | null
  addSupplier: (input: NewSupplierInput) => void
  setCategoryFilter: (c: string) => void
  selectSupplier: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  suppliers: [],
  products: [],
  theme: 'light',
  route: 'suppliers',
  categoryFilter: 'all',
  selectedId: null,
  addSupplier: () => {},
  setCategoryFilter: () => {},
  selectSupplier: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold suppliers/products/theme/route/filter/selectedId in state (seed 3 suppliers
  // + 4 products), implement actions (selectSupplier navigates to supplier-detail),
  // provide through AppContext.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
