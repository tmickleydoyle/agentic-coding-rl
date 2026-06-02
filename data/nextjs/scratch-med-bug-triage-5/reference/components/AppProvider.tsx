'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Bug, Route, Severity } from '../lib/types'

const INITIAL_BUGS: Bug[] = [
  { id: 1, title: 'Login fails on Safari', severity: 'High', status: 'open' },
  { id: 2, title: 'Button misaligned on mobile', severity: 'Medium', status: 'open' },
  { id: 3, title: 'Tooltip flickers', severity: 'Low', status: 'open' },
]

type Ctx = {
  bugs: Bug[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addBug: (title: string, severity: Severity) => void
  toggleBugStatus: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [bugs, setBugs] = useState<Bug[]>(INITIAL_BUGS)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('bugs')
  const [nextId, setNextId] = useState(4)

  function addBug(title: string, severity: Severity) {
    const t = title.trim()
    if (!t) return
    setBugs((b) => [...b, { id: nextId, title: t, severity, status: 'open' }])
    setNextId((n) => n + 1)
  }

  function toggleBugStatus(id: number) {
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
    theme,
    route,
    navigate: setRoute,
    addBug,
    toggleBugStatus,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
