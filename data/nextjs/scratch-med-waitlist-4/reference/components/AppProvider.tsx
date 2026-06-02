'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Entry, Route } from '../lib/types'

type Filter = 'all' | 'pending' | 'invited'

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
  { id: 2, email: 'bob@example.com', source: 'ProductHunt', status: 'pending' },
  { id: 3, email: 'carol@example.com', source: 'Twitter', status: 'invited' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>(SEED)
  const [filter, setFilter] = useState<Filter>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('waitlist')
  const [nextId, setNextId] = useState(4)

  function addEntry(email: string, source: string) {
    const e = email.trim()
    const s = source.trim()
    if (!e || !s) return
    setEntries((prev) => [...prev, { id: nextId, email: e, source: s, status: 'pending' }])
    setNextId((n) => n + 1)
  }

  function invite(id: number) {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, status: 'invited' } : entry)),
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
