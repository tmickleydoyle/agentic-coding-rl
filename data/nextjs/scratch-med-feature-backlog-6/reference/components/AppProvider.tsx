'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Feature, Priority, Route, Status } from '../lib/types'

type Ctx = {
  features: Feature[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addFeature: (title: string, priority: Priority, status: Status) => void
  deleteFeature: (id: number) => void
  updateStatus: (id: number, status: Status) => void
  toggleTheme: () => void
  clearAll: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<Feature[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('backlog')
  const [nextId, setNextId] = useState(1)

  function addFeature(title: string, priority: Priority, status: Status) {
    const t = title.trim()
    if (!t) return
    setFeatures((f) => [...f, { id: nextId, title: t, priority, status }])
    setNextId((n) => n + 1)
  }

  function deleteFeature(id: number) {
    setFeatures((f) => f.filter((x) => x.id !== id))
  }

  function updateStatus(id: number, status: Status) {
    setFeatures((f) => f.map((x) => (x.id === id ? { ...x, status } : x)))
  }

  const value: Ctx = {
    features,
    theme,
    route,
    navigate: setRoute,
    addFeature,
    deleteFeature,
    updateStatus,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    clearAll: () => setFeatures([]),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
