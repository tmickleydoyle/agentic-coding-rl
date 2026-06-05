'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Shift } from '../lib/types'

type Ctx = {
  shifts: Shift[]
  filter: string
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addShift: (name: string, hours: number) => void
  deleteShift: (id: number) => void
  setFilter: (name: string) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [filter, setFilter] = useState<string>('All')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('shifts')
  const [nextId, setNextId] = useState(1)

  function addShift(name: string, hours: number) {
    const n = name.trim()
    if (!n || !isFinite(hours) || hours <= 0) return
    setShifts((s) => [...s, { id: nextId, name: n, hours }])
    setNextId((i) => i + 1)
  }

  function deleteShift(id: number) {
    setShifts((s) => s.filter((x) => x.id !== id))
  }

  const value: Ctx = {
    shifts,
    filter,
    theme,
    route,
    navigate: setRoute,
    addShift,
    deleteShift,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
