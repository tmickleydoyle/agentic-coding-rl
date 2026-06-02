'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Order, OrderStatus, Route } from '../lib/types'

type Ctx = {
  orders: Order[]
  filter: OrderStatus | 'all'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addOrder: (customer: string) => void
  advanceOrder: (id: number) => void
  setFilter: (f: OrderStatus | 'all') => void
  toggleTheme: () => void
  resetOrders: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEQUENCE: OrderStatus[] = ['new', 'packing', 'shipped', 'delivered']

export function AppProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('orders')
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
        const idx = SEQUENCE.indexOf(o.status)
        const next = idx < SEQUENCE.length - 1 ? SEQUENCE[idx + 1] : o.status
        return { ...o, status: next }
      }),
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
    resetOrders: () => setOrders([]),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
