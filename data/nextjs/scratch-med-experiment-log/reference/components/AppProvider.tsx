'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Experiment, Route, Filter } from '../lib/types'

type Ctx = {
  experiments: Experiment[]
  theme: 'light' | 'dark'
  route: Route
  filter: Filter
  navigate: (r: Route) => void
  setFilter: (f: Filter) => void
  addExperiment: (name: string) => void
  markDone: (id: number, winner: 'A' | 'B') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('experiments')
  const [filter, setFilter] = useState<Filter>('All')
  const [nextId, setNextId] = useState(1)

  function addExperiment(name: string) {
    const n = name.trim()
    if (!n) return
    setExperiments((prev) => [...prev, { id: nextId, name: n, status: 'running', winner: null }])
    setNextId((id) => id + 1)
  }

  function markDone(id: number, winner: 'A' | 'B') {
    setExperiments((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'done', winner } : e))
    )
  }

  const value: Ctx = {
    experiments,
    theme,
    route,
    filter,
    navigate: setRoute,
    setFilter,
    addExperiment,
    markDone,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
