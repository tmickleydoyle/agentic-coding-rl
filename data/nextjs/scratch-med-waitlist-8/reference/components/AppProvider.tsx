'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Entry, Route, Source, StatusFilter } from '../lib/types'

const SEED: Entry[] = [
  { id: 1, email: 'alice@example.com', status: 'pending', source: 'Twitter' },
  { id: 2, email: 'bob@example.com', status: 'pending', source: 'Reddit' },
  { id: 3, email: 'carol@example.com', status: 'invited', source: 'Twitter' },
  { id: 4, email: 'dave@example.com', status: 'pending', source: 'Direct' },
  { id: 5, email: 'eve@example.com', status: 'invited', source: 'Reddit' },
]

type Ctx = {
  entries: Entry[]
  filter: StatusFilter
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addEntry: (email: string, source: Source) => void
  invite: (id: number) => void
  setFilter: (f: StatusFilter) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>(SEED)
  const [filter, setFilter] = useState<StatusFilter>('All')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('waitlist')
  const [nextId, setNextId] = useState(6)

  function addEntry(email: string, source: Source) {
    const e = email.trim()
    if (!e) return
    if (entries.some((x) => x.email === e)) return
    setEntries((prev) => [...prev, { id: nextId, email: e, status: 'pending', source }])
    setNextId((n) => n + 1)
  }

  function invite(id: number) {
    setEntries((prev) => prev.map((x) => (x.id === id ? { ...x, status: 'invited' } : x)))
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
