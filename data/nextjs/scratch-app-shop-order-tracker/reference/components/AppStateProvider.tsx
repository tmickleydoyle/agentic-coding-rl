'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Order, Route, StatusFilter, Theme } from '../lib/types'
import { TIMELINE } from '../lib/types'

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

const SEED_ORDERS: Order[] = [
  { id: 'o1', item: 'Aero Mug', total: 12, status: 'delivered' },
  { id: 'o2', item: 'Desk Lamp', total: 30, status: 'shipped' },
  { id: 'o3', item: 'Chef Knife', total: 45, status: 'placed' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('orders')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<ShopApi>(() => {
    const reorder = (id: string) => {
      const src = orders.find((o) => o.id === id)
      if (!src) return
      const newId = `o${nextId}`
      setNextId((n) => n + 1)
      setOrders((prev) => [
        ...prev,
        { id: newId, item: src.item, total: src.total, status: 'placed' },
      ])
    }

    const advance = (id: string) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== id) return o
          const idx = TIMELINE.indexOf(o.status)
          const next = TIMELINE[Math.min(idx + 1, TIMELINE.length - 1)]
          return { ...o, status: next }
        }),
      )
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
      reorder,
      advance,
      selectOrder,
      setStatusFilter,
      setTheme,
      navigate,
    }
  }, [orders, theme, route, selectedId, statusFilter, nextId])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop(): ShopApi {
  const v = useContext(ShopContext)
  if (!v) throw new Error('useShop must be used within an AppStateProvider')
  return v
}
