'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Appointment, AppStatus, Route } from '../lib/types'

type Ctx = {
  appointments: Appointment[]
  filter: AppStatus | 'all'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addAppointment: (customer: string, service: string, status: AppStatus) => void
  deleteAppointment: (id: number) => void
  changeStatus: (id: number, status: AppStatus) => void
  setFilter: (f: AppStatus | 'all') => void
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
  const [filter, setFilter] = useState<AppStatus | 'all'>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('appointments')
  const [nextId, setNextId] = useState(4)

  function addAppointment(customer: string, service: string, status: AppStatus) {
    const c = customer.trim()
    const s = service.trim()
    if (!c || !s) return
    setAppointments((prev) => [...prev, { id: nextId, customer: c, service: s, status }])
    setNextId((n) => n + 1)
  }

  function deleteAppointment(id: number) {
    setAppointments((prev) => prev.filter((a) => a.id !== id))
  }

  function changeStatus(id: number, status: AppStatus) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }

  const value: Ctx = {
    appointments,
    filter,
    theme,
    route,
    navigate: setRoute,
    addAppointment,
    deleteAppointment,
    changeStatus,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
