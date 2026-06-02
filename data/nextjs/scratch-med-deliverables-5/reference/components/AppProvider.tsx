'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Deliverable, Route } from '../lib/types'

type Ctx = {
  deliverables: Deliverable[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addDeliverable: (item: string, due: string) => void
  markDelivered: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
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
    setDeliverables((d) =>
      d.map((x) => (x.id === id ? { ...x, status: 'delivered' } : x)),
    )
  }

  const value: Ctx = {
    deliverables,
    theme,
    route,
    navigate: setRoute,
    addDeliverable,
    markDelivered,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
