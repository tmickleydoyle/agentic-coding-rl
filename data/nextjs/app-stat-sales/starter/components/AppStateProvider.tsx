'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Order, Region, Route, Theme } from '../lib/types'

type AppApi = {
  orders: Order[]
  theme: Theme
  route: Route
  regionFilter: Region | 'all'
  selectedProduct: string | null
  setRegionFilter: (filter: Region | 'all') => void
  selectProduct: (product: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  orders: [],
  theme: 'light',
  route: 'overview',
  regionFilter: 'all',
  selectedProduct: null,
  setRegionFilter: () => {},
  selectProduct: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold orders/theme/route/regionFilter/selection in state (seed 6 orders),
  // implement the actions, and provide them through AppContext. The STUB below makes the
  // app mount but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
