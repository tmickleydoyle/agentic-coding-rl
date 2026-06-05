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
  removeDeliverable: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Deliverable[] = [
  { id: 1, name: 'Design mockups', due: '2024-11-01', status: 'delivered' },
  { id: 2, name: 'API integration', due: '2024-11-15', status: 'pending' },
  { id: 3, name: 'User testing', due: '2024-11-30', status: 'pending' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [deliverables, setDeliverables] = useState<Deliverable[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('deliverables')
  const [nextId, setNextId] = useState(4)

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

  function removeDeliverable(id: number) {
    setDeliverables((prev) => prev.filter((item) => item.id !== id))
  }

  const value: Ctx = {
    deliverables,
    theme,
    route,
    navigate: setRoute,
    addDeliverable,
    markDelivered,
    removeDeliverable,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
