'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Order, OrderStatus, Route } from '../lib/types'

const STATUS_ORDER: OrderStatus[] = ['new', 'packing', 'shipped', 'delivered']

const SEED: Order[] = [
  { id: 1, customer: 'Alice', status: 'new' },
  { id: 2, customer: 'Bob', status: 'packing' },
  { id: 3, customer: 'Carol', status: 'shipped' },
]

type Ctx = {
  orders: Order[]
  filter: string
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addOrder: (customer: string) => void
  advanceOrder: (id: number) => void
  setFilter: (f: string) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(SEED)
  const [filter, setFilter] = useState<string>('All')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('orders')
  const [nextId, setNextId] = useState(4)

  function addOrder(customer: string) {
    const c = customer.trim()
    if (!c) return
    setOrders((prev) => [...prev, { id: nextId, customer: c, status: 'new' }])
    setNextId((n) => n + 1)
  }

  function advanceOrder(id: number) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        const idx = STATUS_ORDER.indexOf(o.status)
        if (idx === STATUS_ORDER.length - 1) return o
        return { ...o, status: STATUS_ORDER[idx + 1] }
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
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
