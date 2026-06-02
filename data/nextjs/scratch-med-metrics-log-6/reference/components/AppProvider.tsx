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
  deleteMetric: (name: string) => void
  clearAll: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('log')
  const [nextId, setNextId] = useState(1)

  function addEntry(name: string, value: string) {
    const trimmedName = name.trim()
    const trimmedValue = value.trim()
    if (!trimmedName || !trimmedValue) return
    const num = Number(trimmedValue)
    if (isNaN(num)) return
    setEntries((prev) => [...prev, { id: nextId, name: trimmedName, value: num }])
    setNextId((n) => n + 1)
  }

  function deleteMetric(name: string) {
    setEntries((prev) => prev.filter((e) => e.name !== name))
  }

  function clearAll() {
    setEntries([])
  }

  const value: Ctx = {
    entries,
    theme,
    route,
    navigate: setRoute,
    addEntry,
    deleteMetric,
    clearAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
