'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Client, ClientStatus, Route } from '../lib/types'

type Ctx = {
  clients: Client[]
  filter: ClientStatus | 'all'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addClient: (name: string, status: ClientStatus, value: number) => void
  removeClient: (id: number) => void
  setFilter: (f: ClientStatus | 'all') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Client[] = [
  { id: 1, name: 'Acme Corp', status: 'active', value: 5000 },
  { id: 2, name: 'Globex', status: 'lead', value: 1200 },
  { id: 3, name: 'Initech', status: 'churned', value: 800 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(SEED)
  const [filter, setFilter] = useState<ClientStatus | 'all'>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('clients')
  const [nextId, setNextId] = useState(4)

  function addClient(name: string, status: ClientStatus, value: number) {
    const n = name.trim()
    if (!n || value <= 0) return
    setClients((cs) => [...cs, { id: nextId, name: n, status, value }])
    setNextId((x) => x + 1)
  }

  function removeClient(id: number) {
    setClients((cs) => cs.filter((c) => c.id !== id))
  }

  const value: Ctx = {
    clients,
    filter,
    theme,
    route,
    navigate: setRoute,
    addClient,
    removeClient,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
