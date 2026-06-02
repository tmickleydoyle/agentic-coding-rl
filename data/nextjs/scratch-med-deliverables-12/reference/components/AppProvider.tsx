'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Deliverable, Route } from '../lib/types'

type Ctx = {
  items: Deliverable[]
  route: Route
  theme: 'light' | 'dark'
  filterPending: boolean
  navigate: (r: Route) => void
  addItem: (name: string, due: string) => void
  markDelivered: (id: number) => void
  deleteItem: (id: number) => void
  toggleFilter: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Deliverable[]>([])
  const [route, setRoute] = useState<Route>('deliverables')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [filterPending, setFilterPending] = useState(false)
  const [nextId, setNextId] = useState(1)

  function addItem(name: string, due: string) {
    const n = name.trim()
    if (!n) return
    setItems((prev) => [...prev, { id: nextId, name: n, due: due.trim(), status: 'pending' }])
    setNextId((x) => x + 1)
  }

  function markDelivered(id: number) {
    setItems((prev) => prev.map((d) => d.id === id ? { ...d, status: 'delivered' } : d))
  }

  function deleteItem(id: number) {
    setItems((prev) => prev.filter((d) => d.id !== id))
  }

  const value: Ctx = {
    items,
    route,
    theme,
    filterPending,
    navigate: setRoute,
    addItem,
    markDelivered,
    deleteItem,
    toggleFilter: () => setFilterPending((f) => !f),
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
