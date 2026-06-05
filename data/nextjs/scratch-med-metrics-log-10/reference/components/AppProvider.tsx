'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Entry, Route } from '../lib/types'

type Ctx = {
  entries: Entry[]
  theme: 'light' | 'dark'
  decimals: number
  route: Route
  navigate: (r: Route) => void
  addEntry: (name: string, value: string) => void
  clearAll: () => void
  toggleTheme: () => void
  setDecimals: (d: number) => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [decimals, setDecimalsState] = useState(2)
  const [route, setRoute] = useState<Route>('log')
  const [nextOrder, setNextOrder] = useState(1)

  function addEntry(name: string, value: string) {
    const n = name.trim()
    const v = value.trim()
    if (!n || !v) return
    const num = parseFloat(v)
    if (isNaN(num)) return
    setEntries((prev) => [...prev, { id: nextOrder, order: nextOrder, name: n, value: num }])
    setNextOrder((o) => o + 1)
  }

  function clearAll() {
    setEntries([])
    setNextOrder(1)
  }

  const value: Ctx = {
    entries,
    theme,
    decimals,
    route,
    navigate: setRoute,
    addEntry,
    clearAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    setDecimals: (d: number) => setDecimalsState(d),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
