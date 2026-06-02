'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Service } from '../lib/types'
import { SEED } from '../lib/seed'

type Ctx = {
  services: Service[]
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addService: (name: string, price: string) => void
  removeService: (id: number) => void
  toggleActive: (id: number) => void
  toggleTheme: () => void
  resetServices: () => void
}

export const AppContext = createContext<Ctx | null>(null)

function cloneSeed(): Service[] {
  return SEED.map((s) => ({ ...s }))
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(cloneSeed)
  const [route, setRoute] = useState<Route>('services')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(SEED.length + 1)

  function addService(name: string, price: string) {
    const n = name.trim()
    const p = parseFloat(price)
    if (!n || isNaN(p) || p <= 0) return
    setServices((s) => [...s, { id: nextId, name: n, price: p, active: true }])
    setNextId((i) => i + 1)
  }

  function removeService(id: number) {
    setServices((s) => s.filter((x) => x.id !== id))
  }

  function toggleActive(id: number) {
    setServices((s) => s.map((x) => (x.id === id ? { ...x, active: !x.active } : x)))
  }

  function resetServices() {
    setServices(cloneSeed())
  }

  const value: Ctx = {
    services,
    route,
    theme,
    navigate: setRoute,
    addService,
    removeService,
    toggleActive,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    resetServices,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
