'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Experiment, Filter, Route } from '../lib/types'

type Ctx = {
  experiments: Experiment[]
  filter: Filter
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addExperiment: (name: string) => void
  markDone: (id: number, winner: 'A' | 'B') => void
  setFilter: (f: Filter) => void
  toggleTheme: () => void
  resetExperiments: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [filter, setFilter] = useState<Filter>('All')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('experiments')
  const [nextId, setNextId] = useState(1)

  function addExperiment(name: string) {
    const n = name.trim()
    if (!n) return
    setExperiments((prev) => [...prev, { id: nextId, name: n, status: 'running', winner: null }])
    setNextId((i) => i + 1)
  }

  function markDone(id: number, winner: 'A' | 'B') {
    setExperiments((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'done', winner } : e)),
    )
  }

  const value: Ctx = {
    experiments,
    filter,
    theme,
    route,
    navigate: setRoute,
    addExperiment,
    markDone,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    resetExperiments: () => setExperiments([]),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
