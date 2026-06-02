'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Deliverable, Route } from '../lib/types'

type Ctx = {
  deliverables: Deliverable[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addDeliverable: (name: string, due: string) => void
  markDelivered: (id: number) => void
  deleteDeliverable: (id: number) => void
  resetAll: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('deliverables')
  const [nextId, setNextId] = useState(1)

  function addDeliverable(name: string, due: string) {
    const n = name.trim()
    const d = due.trim()
    if (!n || !d) return
    setDeliverables((prev) => [...prev, { id: nextId, name: n, due: d, status: 'pending' }])
    setNextId((x) => x + 1)
  }

  function markDelivered(id: number) {
    setDeliverables((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'delivered' } : item)),
    )
  }

  function deleteDeliverable(id: number) {
    setDeliverables((prev) => prev.filter((item) => item.id !== id))
  }

  function resetAll() {
    setDeliverables([])
  }

  const value: Ctx = {
    deliverables,
    theme,
    route,
    navigate: setRoute,
    addDeliverable,
    markDelivered,
    deleteDeliverable,
    resetAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
