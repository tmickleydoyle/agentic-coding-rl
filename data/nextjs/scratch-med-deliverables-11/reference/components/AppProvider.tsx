'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Deliverable, Filter, Route } from '../lib/types'

type Ctx = {
  deliverables: Deliverable[]
  filter: Filter
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addDeliverable: (name: string, due: string) => void
  markDelivered: (id: number) => void
  markPending: (id: number) => void
  setFilter: (f: Filter) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [route, setRoute] = useState<Route>('deliverables')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(1)

  function addDeliverable(name: string, due: string) {
    const n = name.trim()
    if (!n) return
    setDeliverables((d) => [...d, { id: nextId, name: n, due: due.trim(), status: 'pending' }])
    setNextId((id) => id + 1)
  }

  function markDelivered(id: number) {
    setDeliverables((d) => d.map((item) => item.id === id ? { ...item, status: 'delivered' } : item))
  }

  function markPending(id: number) {
    setDeliverables((d) => d.map((item) => item.id === id ? { ...item, status: 'pending' } : item))
  }

  const value: Ctx = {
    deliverables,
    filter,
    route,
    theme,
    navigate: setRoute,
    addDeliverable,
    markDelivered,
    markPending,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
