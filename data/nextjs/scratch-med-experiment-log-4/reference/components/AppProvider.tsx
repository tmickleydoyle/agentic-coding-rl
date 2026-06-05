'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Experiment, Route } from '../lib/types'

type Ctx = {
  experiments: Experiment[]
  theme: 'light' | 'dark'
  route: Route
  showRunningOnly: boolean
  navigate: (r: Route) => void
  addExperiment: (name: string) => void
  markDone: (id: number, winner: 'A' | 'B') => void
  toggleShowRunningOnly: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('experiments')
  const [showRunningOnly, setShowRunningOnly] = useState(false)
  const [nextId, setNextId] = useState(1)

  function addExperiment(name: string) {
    const n = name.trim()
    if (!n) return
    setExperiments((prev) => [...prev, { id: nextId, name: n, status: 'running', winner: null }])
    setNextId((x) => x + 1)
  }

  function markDone(id: number, winner: 'A' | 'B') {
    setExperiments((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'done', winner } : e)),
    )
  }

  const value: Ctx = {
    experiments,
    theme,
    route,
    showRunningOnly,
    navigate: setRoute,
    addExperiment,
    markDone,
    toggleShowRunningOnly: () => setShowRunningOnly((s) => !s),
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
