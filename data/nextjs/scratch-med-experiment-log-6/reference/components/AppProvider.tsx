'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Experiment, Route } from '../lib/types'

type Ctx = {
  experiments: Experiment[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addExperiment: (name: string) => void
  markDone: (id: number, winner: 'A' | 'B') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Experiment[] = [
  { id: 1, name: 'Homepage hero', status: 'done', winner: 'A' },
  { id: 2, name: 'Checkout flow', status: 'running', winner: null },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [experiments, setExperiments] = useState<Experiment[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('experiments')
  const [nextId, setNextId] = useState(3)

  function addExperiment(name: string) {
    const n = name.trim()
    if (!n) return
    setExperiments((prev) => [...prev, { id: nextId, name: n, status: 'running', winner: null }])
    setNextId((id) => id + 1)
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
    navigate: setRoute,
    addExperiment,
    markDone,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
