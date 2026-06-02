'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Service } from '../lib/types'

type Ctx = {
  services: Service[]
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addService: (name: string, price: number) => void
  toggleService: (id: number) => void
  deleteService: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Service[] = [
  { id: 1, name: 'Haircut', price: 25.0, active: true },
  { id: 2, name: 'Beard Trim', price: 15.0, active: true },
  { id: 3, name: 'Hair Color', price: 80.0, active: true },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(SEED)
  const [route, setRoute] = useState<Route>('services')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(4)

  function addService(name: string, price: number) {
    const n = name.trim()
    if (!n || !isFinite(price) || price <= 0) return
    setServices((s) => [...s, { id: nextId, name: n, price, active: true }])
    setNextId((id) => id + 1)
  }

  function toggleService(id: number) {
    setServices((s) => s.map((svc) => svc.id === id ? { ...svc, active: !svc.active } : svc))
  }

  function deleteService(id: number) {
    setServices((s) => s.filter((svc) => svc.id !== id))
  }

  const value: Ctx = {
    services,
    route,
    theme,
    navigate: setRoute,
    addService,
    toggleService,
    deleteService,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
