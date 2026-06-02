'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Appt, Route } from '../lib/types'

type Ctx = {
  appts: Appt[]
  theme: 'light' | 'dark'
  conflictsOnly: boolean
  route: Route
  navigate: (r: Route) => void
  addAppt: (client: string, stylist: string, start: number, duration: number) => void
  removeAppt: (id: number) => void
  toggleTheme: () => void
  toggleConflictsOnly: () => void
}

export const SalonContext = createContext<Ctx | null>(null)

export function SalonProvider({ children }: { children: ReactNode }) {
  const [appts, setAppts] = useState<Appt[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [conflictsOnly, setConflictsOnly] = useState(false)
  const [route, setRoute] = useState<Route>('schedule')
  const [nextId, setNextId] = useState(1)

  function addAppt(client: string, stylist: string, start: number, duration: number) {
    const name = client.trim()
    if (!name) return
    setAppts((a) => [...a, { id: nextId, client: name, stylist, start, duration }])
    setNextId((n) => n + 1)
  }
  function removeAppt(id: number) {
    setAppts((a) => a.filter((x) => x.id !== id))
  }

  const value: Ctx = {
    appts,
    theme,
    conflictsOnly,
    route,
    navigate: setRoute,
    addAppt,
    removeAppt,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleConflictsOnly: () => setConflictsOnly((s) => !s),
  }
  return <SalonContext.Provider value={value}>{children}</SalonContext.Provider>
}
