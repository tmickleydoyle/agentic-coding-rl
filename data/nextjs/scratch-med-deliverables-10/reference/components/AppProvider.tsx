'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Deliverable, Route } from '../lib/types'

type Filter = 'all' | 'pending'

type Ctx = {
  deliverables: Deliverable[]
  filter: Filter
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addDeliverable: (item: string, due: string) => void
  markDelivered: (id: number) => void
  markPending: (id: number) => void
  setFilter: (f: Filter) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('deliverables')
  const [nextId, setNextId] = useState(1)

  function addDeliverable(item: string, due: string) {
    const t = item.trim()
    if (!t) return
    setDeliverables((d) => [...d, { id: nextId, item: t, due: due.trim(), status: 'pending' }])
    setNextId((n) => n + 1)
  }

  function markDelivered(id: number) {
    setDeliverables((d) => d.map((x) => (x.id === id ? { ...x, status: 'delivered' } : x)))
  }

  function markPending(id: number) {
    setDeliverables((d) => d.map((x) => (x.id === id ? { ...x, status: 'pending' } : x)))
  }

  const value: Ctx = {
    deliverables,
    filter,
    theme,
    route,
    navigate: setRoute,
    addDeliverable,
    markDelivered,
    markPending,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
