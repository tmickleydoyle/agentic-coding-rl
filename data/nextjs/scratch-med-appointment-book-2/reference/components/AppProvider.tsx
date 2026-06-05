'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Appointment, AppStatus, Route } from '../lib/types'

type Ctx = {
  appointments: Appointment[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addAppointment: (customer: string, service: string, status: AppStatus) => void
  deleteAppointment: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('appointments')
  const [nextId, setNextId] = useState(1)

  function addAppointment(customer: string, service: string, status: AppStatus) {
    const c = customer.trim()
    const s = service.trim()
    if (!c || !s) return
    setAppointments((a) => [...a, { id: nextId, customer: c, service: s, status }])
    setNextId((n) => n + 1)
  }

  function deleteAppointment(id: number) {
    setAppointments((a) => a.filter((x) => x.id !== id))
  }

  const value: Ctx = {
    appointments,
    theme,
    route,
    navigate: setRoute,
    addAppointment,
    deleteAppointment,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
