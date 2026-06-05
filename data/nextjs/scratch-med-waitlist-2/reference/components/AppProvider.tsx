'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Entry, Route, Source, StatusFilter } from '../lib/types'

const SEED: Entry[] = [
  { id: 1, email: 'alice@example.com', source: 'organic', status: 'invited' },
  { id: 2, email: 'bob@example.com', source: 'referral', status: 'pending' },
  { id: 3, email: 'carol@example.com', source: 'social', status: 'pending' },
]

type Ctx = {
  entries: Entry[]
  route: Route
  theme: 'light' | 'dark'
  statusFilter: StatusFilter
  navigate: (r: Route) => void
  addEntry: (email: string, source: Source) => void
  invite: (id: number) => void
  setStatusFilter: (f: StatusFilter) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>(SEED)
  const [route, setRoute] = useState<Route>('waitlist')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [nextId, setNextId] = useState(4)

  function addEntry(email: string, source: Source) {
    const e = email.trim()
    if (!e) return
    setEntries((prev) => [...prev, { id: nextId, email: e, source, status: 'pending' }])
    setNextId((n) => n + 1)
  }

  function invite(id: number) {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, status: 'invited' } : entry)),
    )
  }

  const value: Ctx = {
    entries,
    route,
    theme,
    statusFilter,
    navigate: setRoute,
    addEntry,
    invite,
    setStatusFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
