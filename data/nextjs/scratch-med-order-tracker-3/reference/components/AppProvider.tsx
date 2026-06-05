'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Order, OrderStatus, Route } from '../lib/types'

type Filter = 'All' | OrderStatus

type Ctx = {
  orders: Order[]
  filter: Filter
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addOrder: (name: string) => void
  advanceOrder: (id: number) => void
  setFilter: (f: Filter) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const PIPELINE: OrderStatus[] = ['new', 'packing', 'shipped', 'delivered']

export function AppProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<Filter>('All')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('orders')
  const [nextId, setNextId] = useState(1)

  function addOrder(name: string) {
    const n = name.trim()
    if (!n) return
    setOrders((prev) => [{ id: nextId, customer: n, status: 'new' }, ...prev])
    setNextId((x) => x + 1)
  }

  function advanceOrder(id: number) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        const idx = PIPELINE.indexOf(o.status)
        if (idx === PIPELINE.length - 1) return o
        return { ...o, status: PIPELINE[idx + 1] }
      })
    )
  }

  const value: Ctx = {
    orders,
    filter,
    theme,
    route,
    navigate: setRoute,
    addOrder,
    advanceOrder,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
