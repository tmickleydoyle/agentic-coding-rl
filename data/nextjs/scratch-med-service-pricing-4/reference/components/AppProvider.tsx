'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Service, Route } from '../lib/types'

type Ctx = {
  services: Service[]
  theme: 'light' | 'dark'
  hideInactive: boolean
  route: Route
  navigate: (r: Route) => void
  addService: (name: string, price: string) => void
  toggleActive: (id: number) => void
  toggleTheme: () => void
  toggleHideInactive: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Service[] = [
  { id: 1, name: 'Haircut', price: 25.0, active: true },
  { id: 2, name: 'Color treatment', price: 85.0, active: true },
  { id: 3, name: 'Blowout', price: 40.0, active: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideInactive, setHideInactive] = useState(false)
  const [route, setRoute] = useState<Route>('services')
  const [nextId, setNextId] = useState(4)

  function addService(name: string, priceStr: string) {
    const n = name.trim()
    if (!n) return
    const price = parseFloat(priceStr)
    if (isNaN(price) || price <= 0) return
    setServices((s) => [...s, { id: nextId, name: n, price, active: true }])
    setNextId((x) => x + 1)
  }

  function toggleActive(id: number) {
    setServices((s) => s.map((svc) => svc.id === id ? { ...svc, active: !svc.active } : svc))
  }

  const value: Ctx = {
    services,
    theme,
    hideInactive,
    route,
    navigate: setRoute,
    addService,
    toggleActive,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideInactive: () => setHideInactive((h) => !h),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
