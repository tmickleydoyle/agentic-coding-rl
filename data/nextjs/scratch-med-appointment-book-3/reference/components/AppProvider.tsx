'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Appointment, AppStatus, Route } from '../lib/types'

type Ctx = {
  appointments: Appointment[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addAppointment: (customer: string, service: string) => void
  markDone: (id: number) => void
  markNoShow: (id: number) => void
  clearAll: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('appointments')
  const [nextId, setNextId] = useState(1)

  function addAppointment(customer: string, service: string) {
    const c = customer.trim()
    const s = service.trim()
    if (!c || !s) return
    setAppointments((prev) => [...prev, { id: nextId, customer: c, service: s, status: 'booked' }])
    setNextId((n) => n + 1)
  }

  function markDone(id: number) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'done' } : a))
    )
  }

  function markNoShow(id: number) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'no-show' } : a))
    )
  }

  function clearAll() {
    setAppointments([])
  }

  const value: Ctx = {
    appointments,
    theme,
    route,
    navigate: setRoute,
    addAppointment,
    markDone,
    markNoShow,
    clearAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
