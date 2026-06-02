'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Order, Route, OrderStatus } from '../lib/types'

const PIPELINE: OrderStatus[] = ['new', 'packing', 'shipped', 'delivered']

type Ctx = {
  orders: Order[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addOrder: (customer: string) => void
  advanceOrder: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('orders')
  const [nextId, setNextId] = useState(1)

  function addOrder(customer: string) {
    const name = customer.trim()
    if (!name) return
    setOrders((o) => [...o, { id: nextId, customer: name, status: 'new' }])
    setNextId((n) => n + 1)
  }

  function advanceOrder(id: number) {
    setOrders((o) =>
      o.map((order) => {
        if (order.id !== id) return order
        const idx = PIPELINE.indexOf(order.status)
        const next = idx < PIPELINE.length - 1 ? PIPELINE[idx + 1] : order.status
        return { ...order, status: next }
      })
    )
  }

  const value: Ctx = {
    orders,
    theme,
    route,
    navigate: setRoute,
    addOrder,
    advanceOrder,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
