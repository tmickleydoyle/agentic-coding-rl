'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Objective, Route } from '../lib/types'

type Ctx = {
  objectives: Objective[]
  theme: 'light' | 'dark'
  filterOnTrack: boolean
  route: Route
  navigate: (r: Route) => void
  addObjective: (title: string) => void
  updateProgress: (id: number, value: number) => void
  deleteObjective: (id: number) => void
  toggleTheme: () => void
  toggleFilterOnTrack: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [filterOnTrack, setFilterOnTrack] = useState(false)
  const [route, setRoute] = useState<Route>('objectives')
  const [nextId, setNextId] = useState(1)

  function addObjective(title: string) {
    const t = title.trim()
    if (!t) return
    setObjectives((prev) => [...prev, { id: nextId, title: t, progress: 0 }])
    setNextId((n) => n + 1)
  }

  function updateProgress(id: number, value: number) {
    const clamped = Math.round(Math.max(0, Math.min(100, value)))
    setObjectives((prev) =>
      prev.map((o) => (o.id === id ? { ...o, progress: clamped } : o))
    )
  }

  function deleteObjective(id: number) {
    setObjectives((prev) => prev.filter((o) => o.id !== id))
  }

  const value: Ctx = {
    objectives,
    theme,
    filterOnTrack,
    route,
    navigate: setRoute,
    addObjective,
    updateProgress,
    deleteObjective,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleFilterOnTrack: () => setFilterOnTrack((f) => !f),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
