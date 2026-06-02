'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { RoadmapItem, Quarter, Status, Route } from '../lib/types'

const SEED: RoadmapItem[] = [
  { id: 1, title: 'Dark mode', quarter: 'Q1', status: 'shipped' },
  { id: 2, title: 'API v2', quarter: 'Q2', status: 'in-progress' },
  { id: 3, title: 'Mobile app', quarter: 'Q3', status: 'planned' },
]

type Ctx = {
  items: RoadmapItem[]
  filterQuarter: Quarter | 'All'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addItem: (title: string, quarter: Quarter, status: Status) => void
  shipItem: (id: number) => void
  setFilterQuarter: (q: Quarter | 'All') => void
  toggleTheme: () => void
  resetItems: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RoadmapItem[]>(SEED)
  const [filterQuarter, setFilterQuarter] = useState<Quarter | 'All'>('All')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('roadmap')
  const [nextId, setNextId] = useState(4)

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

  function resetItems() {
    setItems(SEED)
    setNextId(4)
  }

  const value: Ctx = {
    items,
    filterQuarter,
    theme,
    route,
    navigate: setRoute,
    addItem,
    shipItem,
    setFilterQuarter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    resetItems,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
