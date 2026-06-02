'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { RoadmapItem, Route, Quarter, Status } from '../lib/types'

type Ctx = {
  items: RoadmapItem[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addItem: (title: string, quarter: Quarter, status: Status) => void
  deleteItem: (id: number) => void
  markShipped: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RoadmapItem[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('roadmap')
  const [nextId, setNextId] = useState(1)

  function addItem(title: string, quarter: Quarter, status: Status) {
    const t = title.trim()
    if (!t) return
    setItems((prev) => [...prev, { id: nextId, title: t, quarter, status }])
    setNextId((n) => n + 1)
  }

  function deleteItem(id: number) {
    setItems((prev) => prev.filter((x) => x.id !== id))
  }

  function markShipped(id: number) {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: 'shipped' } : x))
    )
  }

  const value: Ctx = {
    items,
    theme,
    route,
    navigate: setRoute,
    addItem,
    deleteItem,
    markShipped,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
