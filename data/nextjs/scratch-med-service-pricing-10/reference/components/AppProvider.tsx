'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Service } from '../lib/types'

type Ctx = {
  services: Service[]
  route: Route
  theme: 'light' | 'dark'
  showInactive: boolean
  navigate: (r: Route) => void
  addService: (name: string, price: number) => void
  toggleActive: (id: number) => void
  toggleTheme: () => void
  toggleShowInactive: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Service[] = [
  { id: 1, name: 'Haircut', price: 25.0, active: true },
  { id: 2, name: 'Color', price: 80.0, active: true },
  { id: 3, name: 'Blowout', price: 40.0, active: true },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(SEED)
  const [route, setRoute] = useState<Route>('services')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showInactive, setShowInactive] = useState(true)
  const [nextId, setNextId] = useState(4)

  function addService(name: string, price: number) {
    const n = name.trim()
    if (!n || !(price > 0)) return
    setServices((s) => [...s, { id: nextId, name: n, price, active: true }])
    setNextId((id) => id + 1)
  }

  function toggleActive(id: number) {
    setServices((s) => s.map((svc) => (svc.id === id ? { ...svc, active: !svc.active } : svc)))
  }

  const value: Ctx = {
    services,
    route,
    theme,
    showInactive,
    navigate: setRoute,
    addService,
    toggleActive,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleShowInactive: () => setShowInactive((s) => !s),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
