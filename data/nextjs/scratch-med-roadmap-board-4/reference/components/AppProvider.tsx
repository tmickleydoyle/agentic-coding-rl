'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Quarter, RoadmapItem, Route, Status } from '../lib/types'

const SEED: RoadmapItem[] = [
  { id: 1, title: 'Dark mode support', quarter: 'Q1', status: 'planned' },
  { id: 2, title: 'API rate limiting', quarter: 'Q2', status: 'in-progress' },
  { id: 3, title: 'CSV export', quarter: 'Q1', status: 'shipped' },
]

type Ctx = {
  items: RoadmapItem[]
  theme: 'light' | 'dark'
  route: Route
  filterQuarter: Quarter | 'All'
  navigate: (r: Route) => void
  addItem: (title: string, quarter: Quarter, status: Status) => void
  shipItem: (id: number) => void
  setFilterQuarter: (q: Quarter | 'All') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RoadmapItem[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('roadmap')
  const [filterQuarter, setFilterQuarter] = useState<Quarter | 'All'>('All')
  const [nextId, setNextId] = useState(4)

  function addItem(title: string, quarter: Quarter, status: Status) {
    const t = title.trim()
    if (!t) return
    setItems((prev) => [...prev, { id: nextId, title: t, quarter, status }])
    setNextId((n) => n + 1)
  }

  function shipItem(id: number) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'shipped' as Status } : item)),
    )
  }

  const value: Ctx = {
    items,
    theme,
    route,
    filterQuarter,
    navigate: setRoute,
    addItem,
    shipItem,
    setFilterQuarter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
