'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_ORDERS: Order[] = [
  { id: 'o1', product: 'Widget', region: 'NA', revenue: 1000, units: 10, month: 'Jan' },
  { id: 'o2', product: 'Widget', region: 'EU', revenue: 500, units: 5, month: 'Feb' },
  { id: 'o3', product: 'Gadget', region: 'NA', revenue: 800, units: 4, month: 'Jan' },
  { id: 'o4', product: 'Gadget', region: 'APAC', revenue: 1200, units: 6, month: 'Mar' },
  { id: 'o5', product: 'Gizmo', region: 'EU', revenue: 300, units: 3, month: 'Feb' },
  { id: 'o6', product: 'Widget', region: 'APAC', revenue: 700, units: 7, month: 'Mar' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [orders] = useState<Order[]>(SEED_ORDERS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('overview')
  const [regionFilter, setRegionFilter] = useState<Region | 'all'>('all')
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const selectProduct = (product: string) => {
      setSelectedProduct(product)
      setRoute('products')
    }
    const navigate = (next: Route) => setRoute(next)
    return {
      orders,
      theme,
      route,
      regionFilter,
      selectedProduct,
      setRegionFilter,
      selectProduct,
      setTheme,
      navigate,
    }
  }, [orders, theme, route, regionFilter, selectedProduct])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
