'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Quarter, RoadmapItem, Route, Status } from '../lib/types'

type Ctx = {
  items: RoadmapItem[]
  theme: 'light' | 'dark'
  route: Route
  quarterFilter: Quarter | 'All'
  navigate: (r: Route) => void
  addItem: (title: string, quarter: Quarter, status: Status) => void
  shipItem: (id: number) => void
  setQuarterFilter: (q: Quarter | 'All') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RoadmapItem[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('roadmap')
  const [quarterFilter, setQuarterFilter] = useState<Quarter | 'All'>('All')
  const [nextId, setNextId] = useState(1)

  function addItem(title: string, quarter: Quarter, status: Status) {
    const t = title.trim()
    if (!t) return
    setItems((prev) => [...prev, { id: nextId, title: t, quarter, status }])
    setNextId((n) => n + 1)
  }

  function shipItem(id: number) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'shipped' } : item)),
    )
  }

  const value: Ctx = {
    items,
    theme,
    route,
    quarterFilter,
    navigate: setRoute,
    addItem,
    shipItem,
    setQuarterFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
