'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Entry, Route } from '../lib/types'

type Ctx = {
  entries: Entry[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addEntry: (name: string, value: string) => void
  deleteEntry: (id: number) => void
  toggleTheme: () => void
  clearAll: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('log')
  const [nextId, setNextId] = useState(1)

  function addEntry(name: string, value: string) {
    const n = name.trim()
    const v = value.trim()
    if (!n || !v) return
    const num = Number(v)
    if (isNaN(num)) return
    setEntries((es) => [...es, { id: nextId, name: n, value: num }])
    setNextId((i) => i + 1)
  }

  function deleteEntry(id: number) {
    setEntries((es) => es.filter((e) => e.id !== id))
  }

  const value: Ctx = {
    entries,
    theme,
    route,
    navigate: setRoute,
    addEntry,
    deleteEntry,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    clearAll: () => setEntries([]),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
