'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Objective, Route } from '../lib/types'

type Ctx = {
  objectives: Objective[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addObjective: (title: string) => void
  updateProgress: (id: number, progress: number) => void
  deleteObjective: (id: number) => void
  clearAll: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Objective[] = [
  { id: 1, title: 'Grow revenue', progress: 80 },
  { id: 2, title: 'Reduce churn', progress: 60 },
  { id: 3, title: 'Launch mobile app', progress: 40 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [objectives, setObjectives] = useState<Objective[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('objectives')
  const [nextId, setNextId] = useState(4)

  function addObjective(title: string) {
    const t = title.trim()
    if (!t) return
    setObjectives((prev) => [...prev, { id: nextId, title: t, progress: 0 }])
    setNextId((n) => n + 1)
  }

  function updateProgress(id: number, progress: number) {
    const clamped = Math.max(0, Math.min(100, progress))
    setObjectives((prev) => prev.map((o) => (o.id === id ? { ...o, progress: clamped } : o)))
  }

  function deleteObjective(id: number) {
    setObjectives((prev) => prev.filter((o) => o.id !== id))
  }

  function clearAll() {
    setObjectives([])
  }

  const value: Ctx = {
    objectives,
    theme,
    route,
    navigate: setRoute,
    addObjective,
    updateProgress,
    deleteObjective,
    clearAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
