'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Deliverable, Filter, Route } from '../lib/types'

const SEED: Deliverable[] = [
  { id: 1, name: 'Homepage design', due: '2024-06-01', status: 'delivered' },
  { id: 2, name: 'API integration', due: '2024-06-15', status: 'pending' },
  { id: 3, name: 'User testing report', due: '2024-07-01', status: 'pending' },
]

type Ctx = {
  items: Deliverable[]
  filter: Filter
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  setFilter: (f: Filter) => void
  addItem: (name: string, due: string) => void
  markDelivered: (id: number) => void
  markPending: (id: number) => void
  clearAll: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Deliverable[]>(SEED)
  const [filter, setFilter] = useState<Filter>('all')
  const [route, setRoute] = useState<Route>('deliverables')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(4)

  function addItem(name: string, due: string) {
    const n = name.trim()
    if (!n) return
    setItems((prev) => [...prev, { id: nextId, name: n, due: due.trim(), status: 'pending' }])
    setNextId((x) => x + 1)
  }

  function markDelivered(id: number) {
    setItems((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'delivered' } : d)))
  }

  function markPending(id: number) {
    setItems((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'pending' } : d)))
  }

  function clearAll() {
    setItems([])
  }

  const value: Ctx = {
    items,
    filter,
    route,
    theme,
    navigate: setRoute,
    setFilter,
    addItem,
    markDelivered,
    markPending,
    clearAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
