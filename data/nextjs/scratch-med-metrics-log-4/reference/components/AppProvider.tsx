'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Entry, Route } from '../lib/types'

type Ctx = {
  entries: Entry[]
  theme: 'light' | 'dark'
  showTrend: boolean
  route: Route
  navigate: (r: Route) => void
  addEntry: (name: string, value: string) => void
  clearAll: () => void
  toggleTheme: () => void
  toggleShowTrend: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showTrend, setShowTrend] = useState(true)
  const [route, setRoute] = useState<Route>('log')
  const [nextSeq, setNextSeq] = useState(1)

  function addEntry(name: string, value: string) {
    const n = name.trim()
    const v = value.trim()
    if (!n || !v) return
    const num = Number(v)
    if (isNaN(num)) return
    setEntries((prev) => [...prev, { seq: nextSeq, name: n, value: num }])
    setNextSeq((s) => s + 1)
  }

  function clearAll() {
    setEntries([])
  }

  const value: Ctx = {
    entries,
    theme,
    showTrend,
    route,
    navigate: setRoute,
    addEntry,
    clearAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleShowTrend: () => setShowTrend((s) => !s),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
