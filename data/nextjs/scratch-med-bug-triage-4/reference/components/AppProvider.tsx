'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Bug, Route, Severity } from '../lib/types'

const SEED: Bug[] = [
  { id: 1, title: 'Login page crash', severity: 'high', status: 'open' },
  { id: 2, title: 'Typo in footer', severity: 'low', status: 'open' },
]

type Ctx = {
  bugs: Bug[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addBug: (title: string, severity: Severity) => void
  closeBug: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [bugs, setBugs] = useState<Bug[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('bugs')
  const [nextId, setNextId] = useState(3)

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
    theme,
    route,
    navigate: setRoute,
    addBug,
    closeBug,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
