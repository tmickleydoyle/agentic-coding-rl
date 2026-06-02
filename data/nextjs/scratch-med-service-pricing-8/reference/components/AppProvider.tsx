'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Service } from '../lib/types'

type Ctx = {
  services: Service[]
  theme: 'light' | 'dark'
  route: Route
  activeOnly: boolean
  navigate: (r: Route) => void
  addService: (name: string, price: number) => void
  toggleService: (id: number) => void
  toggleTheme: () => void
  resetServices: () => void
  setActiveOnly: (v: boolean) => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Service[] = [
  { id: 1, name: 'Haircut', price: 25.0, active: true },
  { id: 2, name: 'Color treatment', price: 85.0, active: true },
  { id: 3, name: 'Deep conditioning', price: 45.0, active: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('services')
  const [activeOnly, setActiveOnly] = useState(false)
  const [nextId, setNextId] = useState(4)

  function addService(name: string, price: number) {
    const n = name.trim()
    if (!n || !isFinite(price) || price <= 0) return
    setServices((s) => [...s, { id: nextId, name: n, price, active: true }])
    setNextId((id) => id + 1)
  }

  function toggleService(id: number) {
    setServices((s) => s.map((svc) => (svc.id === id ? { ...svc, active: !svc.active } : svc)))
  }

  function resetServices() {
    setServices([])
  }

  const value: Ctx = {
    services,
    theme,
    route,
    activeOnly,
    navigate: setRoute,
    addService,
    toggleService,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    resetServices,
    setActiveOnly,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
