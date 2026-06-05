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
  removeObjective: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('objectives')
  const [nextId, setNextId] = useState(1)

  function addObjective(title: string) {
    const t = title.trim()
    if (!t) return
    setObjectives((prev) => [...prev, { id: nextId, title: t, progress: 0 }])
    setNextId((n) => n + 1)
  }

  function updateProgress(id: number, progress: number) {
    if (progress < 0 || progress > 100) return
    setObjectives((prev) =>
      prev.map((o) => (o.id === id ? { ...o, progress } : o))
    )
  }

  function removeObjective(id: number) {
    setObjectives((prev) => prev.filter((o) => o.id !== id))
  }

  const value: Ctx = {
    objectives,
    theme,
    route,
    navigate: setRoute,
    addObjective,
    updateProgress,
    removeObjective,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
