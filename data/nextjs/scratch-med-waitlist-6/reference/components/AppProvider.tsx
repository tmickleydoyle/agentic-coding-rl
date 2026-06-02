'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Entry, Route, Source } from '../lib/types'

type Ctx = {
  entries: Entry[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addEntry: (email: string, source: Source) => void
  inviteEntry: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('waitlist')
  const [nextId, setNextId] = useState(1)

  function addEntry(email: string, source: Source) {
    const e = email.trim()
    if (!e) return
    setEntries((prev) => [...prev, { id: nextId, email: e, source, status: 'pending' }])
    setNextId((n) => n + 1)
  }

  function inviteEntry(id: number) {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, status: 'invited' } : entry)),
    )
  }

  const value: Ctx = {
    entries,
    theme,
    route,
    navigate: setRoute,
    addEntry,
    inviteEntry,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
