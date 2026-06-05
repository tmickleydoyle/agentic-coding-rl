'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Entry, Route, Source, StatusFilter } from '../lib/types'

type Ctx = {
  entries: Entry[]
  theme: 'light' | 'dark'
  route: Route
  statusFilter: StatusFilter
  navigate: (r: Route) => void
  addEntry: (email: string, source: Source) => void
  inviteEntry: (id: number) => void
  setStatusFilter: (f: StatusFilter) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Entry[] = [
  { id: 1, email: 'alice@example.com', source: 'twitter', status: 'pending' },
  { id: 2, email: 'bob@example.com', source: 'linkedin', status: 'pending' },
  { id: 3, email: 'carol@example.com', source: 'twitter', status: 'pending' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('waitlist')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [nextId, setNextId] = useState(4)

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
    statusFilter,
    navigate: setRoute,
    addEntry,
    inviteEntry,
    setStatusFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
