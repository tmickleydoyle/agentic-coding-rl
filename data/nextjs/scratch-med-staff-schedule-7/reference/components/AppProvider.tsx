'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Shift } from '../lib/types'

type Ctx = {
  shifts: Shift[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addShift: (employee: string, hours: number) => void
  deleteShift: (id: number) => void
  clearAll: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Shift[] = [
  { id: 1, employee: 'Alice', hours: 8 },
  { id: 2, employee: 'Bob', hours: 6 },
  { id: 3, employee: 'Alice', hours: 4 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [shifts, setShifts] = useState<Shift[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('shifts')
  const [nextId, setNextId] = useState(4)

  function addShift(employee: string, hours: number) {
    const e = employee.trim()
    if (!e || !Number.isFinite(hours) || hours <= 0) return
    setShifts((s) => [...s, { id: nextId, employee: e, hours }])
    setNextId((n) => n + 1)
  }

  function deleteShift(id: number) {
    setShifts((s) => s.filter((sh) => sh.id !== id))
  }

  function clearAll() {
    setShifts([])
  }

  const value: Ctx = {
    shifts,
    theme,
    route,
    navigate: setRoute,
    addShift,
    deleteShift,
    clearAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
