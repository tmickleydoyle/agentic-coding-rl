'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Experiment, Route, Filter } from '../lib/types'

type Ctx = {
  experiments: Experiment[]
  route: Route
  theme: 'light' | 'dark'
  filter: Filter
  navigate: (r: Route) => void
  addExperiment: (name: string) => void
  startMarkDone: (id: number) => void
  setWinner: (id: number, winner: 'A' | 'B') => void
  setFilter: (f: Filter) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [route, setRoute] = useState<Route>('experiments')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [filter, setFilter] = useState<Filter>('All')
  const [nextId, setNextId] = useState(1)
  const [pendingDone, setPendingDone] = useState<number | null>(null)

  function addExperiment(name: string) {
    const n = name.trim()
    if (!n) return
    setExperiments((prev) => [
      ...prev,
      { id: nextId, name: n, status: 'running', winner: null, pickingWinner: false },
    ])
    setNextId((i) => i + 1)
  }

  function startMarkDone(id: number) {
    setExperiments((prev) =>
      prev.map((e) => (e.id === id ? { ...e, pickingWinner: true } : e)),
    )
  }

  function setWinner(id: number, winner: 'A' | 'B') {
    setExperiments((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'done', winner, pickingWinner: false } : e,
      ),
    )
  }

  const value: Ctx = {
    experiments,
    route,
    theme,
    filter,
    navigate: setRoute,
    addExperiment,
    startMarkDone,
    setWinner,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
