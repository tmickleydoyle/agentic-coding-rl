'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { RoadmapItem, Route, Quarter, Status } from '../lib/types'

type Ctx = {
  items: RoadmapItem[]
  route: Route
  theme: 'light' | 'dark'
  filterQuarter: string
  navigate: (r: Route) => void
  addItem: (title: string, quarter: Quarter, status: Status) => void
  shipItem: (id: number) => void
  setFilterQuarter: (q: string) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: RoadmapItem[] = [
  { id: 1, title: 'Mobile login', quarter: 'Q1', status: 'shipped' },
  { id: 2, title: 'Dashboard v2', quarter: 'Q2', status: 'in-progress' },
  { id: 3, title: 'API rate limiting', quarter: 'Q3', status: 'planned' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RoadmapItem[]>(SEED)
  const [route, setRoute] = useState<Route>('roadmap')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [filterQuarter, setFilterQuarter] = useState<string>('All')
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

  const value: Ctx = {
    items,
    route,
    theme,
    filterQuarter,
    navigate: setRoute,
    addItem,
    shipItem,
    setFilterQuarter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
