'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Shift, Route } from '../lib/types'

type Ctx = {
  shifts: Shift[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addShift: (employee: string, hours: number) => void
  removeShift: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('shifts')
  const [nextId, setNextId] = useState(1)

  function addShift(employee: string, hours: number) {
    const emp = employee.trim()
    if (!emp || hours <= 0) return
    setShifts((s) => [...s, { id: nextId, employee: emp, hours }])
    setNextId((n) => n + 1)
  }

  function removeShift(id: number) {
    setShifts((s) => s.filter((sh) => sh.id !== id))
  }

  const value: Ctx = {
    shifts,
    theme,
    route,
    navigate: setRoute,
    addShift,
    removeShift,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
