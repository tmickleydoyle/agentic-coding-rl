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
  addService: (name: string, price: string) => void
  deleteService: (id: number) => void
  toggleActive: (id: number) => void
  toggleTheme: () => void
  toggleHideInactive: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Service[] = [
  { id: 1, name: 'Haircut', price: 25.0, active: true },
  { id: 2, name: 'Coloring', price: 80.0, active: true },
  { id: 3, name: 'Trim', price: 15.0, active: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(SEED)
  const [route, setRoute] = useState<Route>('services')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideInactive, setHideInactive] = useState(false)
  const [nextId, setNextId] = useState(4)

  function addService(name: string, priceStr: string) {
    const n = name.trim()
    if (!n) return
    const p = parseFloat(priceStr)
    if (isNaN(p) || p <= 0) return
    setServices((s) => [...s, { id: nextId, name: n, price: p, active: true }])
    setNextId((id) => id + 1)
  }

  function deleteService(id: number) {
    setServices((s) => s.filter((x) => x.id !== id))
  }

  function toggleActive(id: number) {
    setServices((s) => s.map((x) => (x.id === id ? { ...x, active: !x.active } : x)))
  }

  const value: Ctx = {
    services,
    route,
    theme,
    hideInactive,
    navigate: setRoute,
    addService,
    deleteService,
    toggleActive,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideInactive: () => setHideInactive((h) => !h),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
