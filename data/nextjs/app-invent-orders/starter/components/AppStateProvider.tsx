'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { PurchaseOrder, Route, StatusFilter, Theme } from '../lib/types'

type OrdersApi = {
  orders: PurchaseOrder[]
  theme: Theme
  route: Route
  selectedId: string | null
  statusFilter: StatusFilter
  receive: (id: string, qty: number) => void
  cancel: (id: string) => void
  addOrder: (input: { supplier: string; item: string; ordered: number }) => void
  selectOrder: (id: string) => void
  setStatusFilter: (filter: StatusFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const OrdersContext = createContext<OrdersApi | null>(null)

const STUB: OrdersApi = {
  orders: [],
  theme: 'light',
  route: 'orders',
  selectedId: null,
  statusFilter: 'all',
  receive: () => {},
  cancel: () => {},
  addOrder: () => {},
  selectOrder: () => {},
  setStatusFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold orders/theme/route/selectedId/statusFilter in state (seed 3 orders),
  // implement receive/cancel/addOrder/selectOrder and the rest, and provide them through
  // OrdersContext. The STUB below makes the app mount but does nothing.
  return <OrdersContext.Provider value={STUB}>{children}</OrdersContext.Provider>
}

export function useOrdersState(): OrdersApi {
  const v = useContext(OrdersContext)
  if (!v) throw new Error('useOrdersState must be used within an AppStateProvider')
  return v
}
