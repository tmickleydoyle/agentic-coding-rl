'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Deliverable, Route } from '../lib/types'

type Filter = 'all' | 'pending'

type Ctx = {
  items: Deliverable[]
  filter: Filter
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addItem: (name: string, due: string) => void
  markDelivered: (id: number) => void
  markPending: (id: number) => void
  setFilter: (f: Filter) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Deliverable[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('deliverables')
  const [nextId, setNextId] = useState(1)

  function addItem(name: string, due: string) {
    const n = name.trim()
    if (!n) return
    setItems((prev) => [...prev, { id: nextId, name: n, due: due.trim(), status: 'pending' }])
    setNextId((x) => x + 1)
  }

  function markDelivered(id: number) {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, status: 'delivered' } : it))
  }

  function markPending(id: number) {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, status: 'pending' } : it))
  }

  const value: Ctx = {
    items,
    filter,
    theme,
    route,
    navigate: setRoute,
    addItem,
    markDelivered,
    markPending,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
