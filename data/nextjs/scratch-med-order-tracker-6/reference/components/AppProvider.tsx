'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Order, OrderStatus, Route } from '../lib/types'

export type Ctx = {
  orders: Order[]
  theme: 'light' | 'dark'
  route: Route
  filter: OrderStatus | 'all'
  navigate: (r: Route) => void
  addOrder: (customer: string) => void
  advanceOrder: (id: number) => void
  setFilter: (f: OrderStatus | 'all') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const PIPELINE: OrderStatus[] = ['new', 'packing', 'shipped', 'delivered']

export function AppProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('orders')
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [nextId, setNextId] = useState(1)

  function addOrder(customer: string) {
    const name = customer.trim()
    if (!name) return
    setOrders((prev) => [...prev, { id: nextId, customer: name, status: 'new' }])
    setNextId((n) => n + 1)
  }

  function advanceOrder(id: number) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        const idx = PIPELINE.indexOf(o.status)
        if (idx === PIPELINE.length - 1) return o
        return { ...o, status: PIPELINE[idx + 1] }
      }),
    )
  }

  const value: Ctx = {
    orders,
    theme,
    route,
    filter,
    navigate: setRoute,
    addOrder,
    advanceOrder,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
