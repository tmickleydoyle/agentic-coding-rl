'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Service } from '../lib/types'

type Ctx = {
  services: Service[]
  route: Route
  theme: 'light' | 'dark'
  hideInactive: boolean
  navigate: (r: Route) => void
  addService: (name: string, price: number) => void
  removeService: (id: number) => void
  toggleActive: (id: number) => void
  toggleTheme: () => void
  toggleHideInactive: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Service[] = [
  { id: 1, name: 'Logo design', price: 150.00, active: true },
  { id: 2, name: 'Business card print', price: 45.50, active: true },
  { id: 3, name: 'Social media kit', price: 89.00, active: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(SEED)
  const [route, setRoute] = useState<Route>('services')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideInactive, setHideInactive] = useState(false)
  const [nextId, setNextId] = useState(4)

  function addService(name: string, price: number) {
    const n = name.trim()
    if (!n || price <= 0 || isNaN(price)) return
    setServices((s) => [...s, { id: nextId, name: n, price, active: true }])
    setNextId((id) => id + 1)
  }

  function removeService(id: number) {
    setServices((s) => s.filter((x) => x.id !== id))
  }

  function toggleActive(id: number) {
    setServices((s) => s.map((x) => x.id === id ? { ...x, active: !x.active } : x))
  }

  const value: Ctx = {
    services,
    route,
    theme,
    hideInactive,
    navigate: setRoute,
    addService,
    removeService,
    toggleActive,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideInactive: () => setHideInactive((h) => !h),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
