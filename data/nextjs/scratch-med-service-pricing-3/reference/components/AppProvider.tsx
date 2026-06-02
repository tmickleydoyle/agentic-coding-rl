'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Service, Route } from '../lib/types'

type Ctx = {
  services: Service[]
  route: Route
  theme: 'light' | 'dark'
  showInactive: boolean
  navigate: (r: Route) => void
  addService: (name: string, price: number) => void
  toggleActive: (id: number) => void
  deleteService: (id: number) => void
  toggleTheme: () => void
  toggleShowInactive: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Service[] = [
  { id: 1, name: 'Logo design', price: 120.00, active: true },
  { id: 2, name: 'Brand consultation', price: 200.00, active: true },
  { id: 3, name: 'Social media kit', price: 85.00, active: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(SEED)
  const [route, setRoute] = useState<Route>('services')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showInactive, setShowInactive] = useState(true)
  const [nextId, setNextId] = useState(4)

  function addService(name: string, price: number) {
    const n = name.trim()
    if (!n || !isFinite(price) || price <= 0) return
    setServices((s) => [...s, { id: nextId, name: n, price, active: true }])
    setNextId((i) => i + 1)
  }

  function toggleActive(id: number) {
    setServices((s) => s.map((svc) => svc.id === id ? { ...svc, active: !svc.active } : svc))
  }

  function deleteService(id: number) {
    setServices((s) => s.filter((svc) => svc.id !== id))
  }

  const value: Ctx = {
    services,
    route,
    theme,
    showInactive,
    navigate: setRoute,
    addService,
    toggleActive,
    deleteService,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleShowInactive: () => setShowInactive((s) => !s),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
