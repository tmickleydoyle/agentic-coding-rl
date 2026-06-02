'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Feature, Priority, Status, Route } from '../lib/types'

type Ctx = {
  features: Feature[]
  theme: 'light' | 'dark'
  route: Route
  filterPriority: Priority | 'All'
  filterStatus: Status | 'All'
  navigate: (r: Route) => void
  addFeature: (title: string) => void
  deleteFeature: (id: number) => void
  updatePriority: (id: number, priority: Priority) => void
  updateStatus: (id: number, status: Status) => void
  setFilterPriority: (p: Priority | 'All') => void
  setFilterStatus: (s: Status | 'All') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<Feature[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('backlog')
  const [nextId, setNextId] = useState(1)
  const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All')
  const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All')

  function addFeature(title: string) {
    const t = title.trim()
    if (!t) return
    setFeatures((f) => [...f, { id: nextId, title: t, priority: 'P1', status: 'idea' }])
    setNextId((n) => n + 1)
  }

  function deleteFeature(id: number) {
    setFeatures((f) => f.filter((x) => x.id !== id))
  }

  function updatePriority(id: number, priority: Priority) {
    setFeatures((f) => f.map((x) => (x.id === id ? { ...x, priority } : x)))
  }

  function updateStatus(id: number, status: Status) {
    setFeatures((f) => f.map((x) => (x.id === id ? { ...x, status } : x)))
  }

  const value: Ctx = {
    features,
    theme,
    route,
    filterPriority,
    filterStatus,
    navigate: setRoute,
    addFeature,
    deleteFeature,
    updatePriority,
    updateStatus,
    setFilterPriority,
    setFilterStatus,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
