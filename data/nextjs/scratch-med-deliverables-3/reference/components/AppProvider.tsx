'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Deliverable, Route } from '../lib/types'

type Ctx = {
  items: Deliverable[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addItem: (name: string, due: string) => void
  markDelivered: (id: number) => void
  deleteItem: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Deliverable[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('deliverables')
  const [nextId, setNextId] = useState(1)

  function addItem(name: string, due: string) {
    const n = name.trim()
    if (!n) return
    setItems((prev) => [...prev, { id: nextId, name: n, due: due.trim(), status: 'pending' }])
    setNextId((id) => id + 1)
  }

  function markDelivered(id: number) {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, status: 'delivered' } : item))
  }

  function deleteItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const value: Ctx = {
    items,
    theme,
    route,
    navigate: setRoute,
    addItem,
    markDelivered,
    deleteItem,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
