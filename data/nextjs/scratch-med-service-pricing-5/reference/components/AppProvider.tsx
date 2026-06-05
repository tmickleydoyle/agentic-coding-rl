'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Service, Route } from '../lib/types'

type Filter = 'all' | 'active'

type Ctx = {
  services: Service[]
  filter: Filter
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addService: (name: string, price: number) => void
  toggleActive: (id: number) => void
  setFilter: (f: Filter) => void
  toggleTheme: () => void
  clearAll: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Service[] = [
  { id: 1, name: 'Haircut', price: 25.00, active: true },
  { id: 2, name: 'Color treatment', price: 85.00, active: true },
  { id: 3, name: 'Deep condition', price: 40.00, active: true },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(SEED)
  const [filter, setFilter] = useState<Filter>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('services')
  const [nextId, setNextId] = useState(4)

  function addService(name: string, price: number) {
    const n = name.trim()
    if (!n || price <= 0 || isNaN(price)) return
    setServices((s) => [...s, { id: nextId, name: n, price, active: true }])
    setNextId((id) => id + 1)
  }

  function toggleActive(id: number) {
    setServices((s) => s.map((svc) => svc.id === id ? { ...svc, active: !svc.active } : svc))
  }

  function clearAll() {
    setServices([])
  }

  const value: Ctx = {
    services,
    filter,
    theme,
    route,
    navigate: setRoute,
    addService,
    toggleActive,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    clearAll,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
