'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Entry, Route } from '../lib/types'

type Ctx = {
  entries: Entry[]
  theme: 'light' | 'dark'
  filterLow: boolean
  route: Route
  navigate: (r: Route) => void
  addEntry: (name: string, value: string) => void
  clearAll: () => void
  toggleTheme: () => void
  toggleFilterLow: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [filterLow, setFilterLow] = useState(false)
  const [route, setRoute] = useState<Route>('log')
  const [nextId, setNextId] = useState(1)

  function addEntry(name: string, value: string) {
    const n = name.trim()
    const v = value.trim()
    if (!n || v === '') return
    const num = parseFloat(v)
    if (isNaN(num)) return
    setEntries((es) => [...es, { id: nextId, name: n, value: num }])
    setNextId((id) => id + 1)
  }

  function clearAll() {
    setEntries([])
  }

  const value: Ctx = {
    entries,
    theme,
    filterLow,
    route,
    navigate: setRoute,
    addEntry,
    clearAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleFilterLow: () => setFilterLow((f) => !f),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
