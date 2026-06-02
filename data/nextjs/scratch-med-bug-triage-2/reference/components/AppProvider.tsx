'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Bug, Route, Severity, FilterStatus } from '../lib/types'

type Ctx = {
  bugs: Bug[]
  filter: FilterStatus
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addBug: (title: string, severity: Severity) => void
  closeBug: (id: number) => void
  setFilter: (f: FilterStatus) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [bugs, setBugs] = useState<Bug[]>([])
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('bugs')
  const [nextId, setNextId] = useState(1)

  function addBug(title: string, severity: Severity) {
    const t = title.trim()
    if (!t) return
    setBugs((b) => [...b, { id: nextId, title: t, severity, status: 'open' }])
    setNextId((n) => n + 1)
  }

  function closeBug(id: number) {
    setBugs((b) => b.map((bug) => (bug.id === id ? { ...bug, status: 'closed' } : bug)))
  }

  const value: Ctx = {
    bugs,
    filter,
    theme,
    route,
    navigate: setRoute,
    addBug,
    closeBug,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
