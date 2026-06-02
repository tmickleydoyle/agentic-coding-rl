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
  { id: 1, name: 'Acme Corp', status: 'active', value: 12000 },
  { id: 2, name: 'Bright Labs', status: 'lead', value: 0 },
  { id: 3, name: 'Cloud Nine', status: 'churned', value: 4500 },
  { id: 4, name: 'Delta Works', status: 'active', value: 8750 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(SEED)
  const [filter, setFilter] = useState<ClientStatus | 'all'>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('roster')
  const [nextId, setNextId] = useState(5)

  function addClient(name: string, status: ClientStatus, value: number) {
    const t = name.trim()
    if (!t) return
    setClients((cs) => [...cs, { id: nextId, name: t, status, value }])
    setNextId((n) => n + 1)
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
