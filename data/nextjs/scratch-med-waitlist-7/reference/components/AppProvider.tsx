'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Entry, Filter, Route } from '../lib/types'

type Ctx = {
  entries: Entry[]
  filter: Filter
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addEntry: (email: string, source: string) => void
  invite: (id: number) => void
  setFilter: (f: Filter) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Entry[] = [
  { id: 1, email: 'alice@example.com', source: 'Twitter', status: 'pending' },
  { id: 2, email: 'bob@example.com', source: 'Friend', status: 'invited' },
  { id: 3, email: 'carol@example.com', source: 'Twitter', status: 'pending' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>(SEED)
  const [filter, setFilter] = useState<Filter>('All')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('waitlist')
  const [nextId, setNextId] = useState(4)

  function addEntry(email: string, source: string) {
    const e = email.trim()
    if (!e) return
    const s = source.trim() || 'Direct'
    setEntries((prev) => [...prev, { id: nextId, email: e, source: s, status: 'pending' }])
    setNextId((n) => n + 1)
  }

  function invite(id: number) {
    setEntries((prev) =>
      prev.map((en) => (en.id === id ? { ...en, status: 'invited' } : en)),
    )
  }

  const value: Ctx = {
    entries,
    filter,
    theme,
    route,
    navigate: setRoute,
    addEntry,
    invite,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
