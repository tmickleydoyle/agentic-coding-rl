'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED: PurchaseOrder[] = [
  { id: 'po1', supplier: 'Acme', item: 'Bolts', ordered: 100, received: 100, cancelled: false },
  { id: 'po2', supplier: 'Acme', item: 'Nuts', ordered: 50, received: 20, cancelled: false },
  { id: 'po3', supplier: 'Globex', item: 'Washers', ordered: 200, received: 0, cancelled: false },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<PurchaseOrder[]>(SEED)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('orders')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<OrdersApi>(() => {
    const receive = (id: string, qty: number) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== id || o.cancelled) return o
          return { ...o, received: Math.min(o.ordered, o.received + Math.max(0, qty)) }
        }),
      )
    }

    const cancel = (id: string) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, cancelled: true } : o)))
    }

    const addOrder = (input: { supplier: string; item: string; ordered: number }) => {
      const id = `po${nextId}`
      setNextId((n) => n + 1)
      setOrders((prev) => [
        ...prev,
        {
          id,
          supplier: input.supplier,
          item: input.item,
          ordered: input.ordered,
          received: 0,
          cancelled: false,
        },
      ])
      setSelectedId(id)
      setRoute('order-detail')
    }

    const selectOrder = (id: string) => {
      setSelectedId(id)
      setRoute('order-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      orders,
      theme,
      route,
      selectedId,
      statusFilter,
      receive,
      cancel,
      addOrder,
      selectOrder,
      setStatusFilter,
      setTheme,
      navigate,
    }
  }, [orders, theme, route, selectedId, statusFilter, nextId])

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrdersState(): OrdersApi {
  const v = useContext(OrdersContext)
  if (!v) throw new Error('useOrdersState must be used within an AppStateProvider')
  return v
}
