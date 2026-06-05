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
  markStatus: (id: number, status: AppStatus) => void
  deleteAppointment: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Appointment[] = [
  { id: 1, customer: 'Alice', service: 'Haircut', status: 'booked' },
  { id: 2, customer: 'Bob', service: 'Massage', status: 'done' },
  { id: 3, customer: 'Carol', service: 'Facial', status: 'no-show' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('appointments')
  const [nextId, setNextId] = useState(4)

  function addAppointment(customer: string, service: string) {
    const c = customer.trim()
    const s = service.trim()
    if (!c || !s) return
    setAppointments((a) => [...a, { id: nextId, customer: c, service: s, status: 'booked' }])
    setNextId((n) => n + 1)
  }

  function markStatus(id: number, status: AppStatus) {
    setAppointments((a) => a.map((x) => (x.id === id ? { ...x, status } : x)))
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
    markStatus,
    deleteAppointment,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
