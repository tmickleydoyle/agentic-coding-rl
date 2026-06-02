'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Client, ClientStatus, Route } from '../lib/types'

const SEED: Client[] = [
  { id: 1, name: 'Acme Corp', status: 'active', lifetimeValue: 5000 },
  { id: 2, name: 'Globex', status: 'lead', lifetimeValue: 0 },
  { id: 3, name: 'Initech', status: 'churned', lifetimeValue: 3200 },
]

type Ctx = {
  clients: Client[]
  filter: ClientStatus | 'all'
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  setFilter: (f: ClientStatus | 'all') => void
  addClient: (name: string, status: ClientStatus, lifetimeValue: number) => void
  deleteClient: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(SEED)
  const [filter, setFilter] = useState<ClientStatus | 'all'>('all')
  const [route, setRoute] = useState<Route>('clients')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(4)

  function addClient(name: string, status: ClientStatus, lifetimeValue: number) {
    const n = name.trim()
    if (!n) return
    if (!isFinite(lifetimeValue) || lifetimeValue < 0) return
    setClients((c) => [...c, { id: nextId, name: n, status, lifetimeValue }])
    setNextId((i) => i + 1)
  }

  function deleteClient(id: number) {
    setClients((c) => c.filter((x) => x.id !== id))
  }

  const value: Ctx = {
    clients,
    filter,
    route,
    theme,
    navigate: setRoute,
    setFilter,
    addClient,
    deleteClient,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
