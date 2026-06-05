'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Appt, Route, Status } from '../lib/types'
import { priceOf } from '../lib/types'

type Ctx = {
  appts: Appt[]
  theme: 'light' | 'dark'
  hideCancelled: boolean
  route: Route
  navigate: (r: Route) => void
  addAppt: (client: string, stylist: string, service: string) => void
  setStatus: (id: number, status: Status) => void
  toggleTheme: () => void
  toggleHideCancelled: () => void
}

export const SalonContext = createContext<Ctx | null>(null)

export function SalonProvider({ children }: { children: ReactNode }) {
  const [appts, setAppts] = useState<Appt[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideCancelled, setHideCancelled] = useState(false)
  const [route, setRoute] = useState<Route>('appointments')
  const [nextId, setNextId] = useState(1)

  function addAppt(client: string, stylist: string, service: string) {
    const name = client.trim()
    if (!name) return
    setAppts((a) => [
      ...a,
      { id: nextId, client: name, stylist, service, price: priceOf(service), status: 'booked' },
    ])
    setNextId((n) => n + 1)
  }

  function setStatus(id: number, status: Status) {
    setAppts((a) => a.map((x) => (x.id === id ? { ...x, status } : x)))
  }

  const value: Ctx = {
    appts,
    theme,
    hideCancelled,
    route,
    navigate: setRoute,
    addAppt,
    setStatus,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideCancelled: () => setHideCancelled((s) => !s),
  }
  return <SalonContext.Provider value={value}>{children}</SalonContext.Provider>
}
