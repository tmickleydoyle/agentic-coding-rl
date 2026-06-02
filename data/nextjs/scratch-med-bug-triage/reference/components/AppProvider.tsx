'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Bug, Route, Severity } from '../lib/types'

type Ctx = {
  bugs: Bug[]
  filter: 'all' | 'open' | 'closed'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addBug: (title: string, severity: Severity) => void
  toggleBug: (id: number) => void
  setFilter: (f: 'all' | 'open' | 'closed') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Bug[] = [
  { id: 1, title: 'Login page crashes', severity: 'high', status: 'open' },
  { id: 2, title: 'Tooltip flicker', severity: 'low', status: 'open' },
  { id: 3, title: 'Wrong favicon', severity: 'low', status: 'closed' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [bugs, setBugs] = useState<Bug[]>(SEED)
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('bugs')
  const [nextId, setNextId] = useState(4)

  function addBug(title: string, severity: Severity) {
    const t = title.trim()
    if (!t) return
    setBugs((b) => [...b, { id: nextId, title: t, severity, status: 'open' }])
    setNextId((n) => n + 1)
  }

  function toggleBug(id: number) {
    setBugs((b) =>
      b.map((bug) =>
        bug.id === id
          ? { ...bug, status: bug.status === 'open' ? 'closed' : 'open' }
          : bug,
      ),
    )
  }

  const value: Ctx = {
    bugs,
    filter,
    theme,
    route,
    navigate: setRoute,
    addBug,
    toggleBug,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
