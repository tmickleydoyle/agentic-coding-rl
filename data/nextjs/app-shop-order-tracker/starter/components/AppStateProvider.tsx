'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Order, Route, StatusFilter, Theme } from '../lib/types'

type ShopApi = {
  orders: Order[]
  theme: Theme
  route: Route
  selectedId: string | null
  statusFilter: StatusFilter
  reorder: (id: string) => void
  advance: (id: string) => void
  selectOrder: (id: string) => void
  setStatusFilter: (filter: StatusFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const ShopContext = createContext<ShopApi | null>(null)

const STUB: ShopApi = {
  orders: [],
  theme: 'light',
  route: 'orders',
  selectedId: null,
  statusFilter: 'all',
  reorder: () => {},
  advance: () => {},
  selectOrder: () => {},
  setStatusFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold orders/theme/route/selectedId/statusFilter in state (seed 3 orders),
  // implement reorder/advance/selectOrder and the rest, and provide them through
  // ShopContext. The STUB below makes the app mount but does nothing.
  return <ShopContext.Provider value={STUB}>{children}</ShopContext.Provider>
}

export function useShop(): ShopApi {
  const v = useContext(ShopContext)
  if (!v) throw new Error('useShop must be used within an AppStateProvider')
  return v
}
