'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Service, Route, Filter } from '../lib/types'

type Ctx = {
  services: Service[]
  filter: Filter
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addService: (name: string, price: string) => void
  deleteService: (id: number) => void
  toggleActive: (id: number) => void
  setFilter: (f: Filter) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Service[] = [
  { id: 1, name: 'Consultation', price: 50.00, active: true },
  { id: 2, name: 'Design', price: 120.00, active: true },
  { id: 3, name: 'Support', price: 30.00, active: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(SEED)
  const [filter, setFilter] = useState<Filter>('all')
  const [route, setRoute] = useState<Route>('services')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(4)

  function addService(name: string, price: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    const parsed = parseFloat(price)
    if (isNaN(parsed) || parsed <= 0) return
    setServices(s => [...s, { id: nextId, name: trimmed, price: parsed, active: true }])
    setNextId(n => n + 1)
  }

  function deleteService(id: number) {
    setServices(s => s.filter(x => x.id !== id))
  }

  function toggleActive(id: number) {
    setServices(s => s.map(x => x.id === id ? { ...x, active: !x.active } : x))
  }

  const value: Ctx = {
    services,
    filter,
    route,
    theme,
    navigate: setRoute,
    addService,
    deleteService,
    toggleActive,
    setFilter,
    toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light'),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
