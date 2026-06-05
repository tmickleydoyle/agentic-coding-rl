'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Client, ClientStatus, Route } from '../lib/types'

const SEED: Client[] = [
  { id: 1, name: 'Acme Corp', status: 'active', lifetimeValue: 5000 },
  { id: 2, name: 'Globex', status: 'lead', lifetimeValue: 1200 },
  { id: 3, name: 'Initech', status: 'churned', lifetimeValue: 800 },
]

type Ctx = {
  clients: Client[]
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addClient: (name: string, status: ClientStatus, lifetimeValue: number) => void
  removeClient: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(SEED)
  const [route, setRoute] = useState<Route>('clients')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(4)

  function addClient(name: string, status: ClientStatus, lifetimeValue: number) {
    const n = name.trim()
    if (!n || lifetimeValue <= 0) return
    setClients((c) => [...c, { id: nextId, name: n, status, lifetimeValue }])
    setNextId((x) => x + 1)
  }

  function removeClient(id: number) {
    setClients((c) => c.filter((cl) => cl.id !== id))
  }

  const value: Ctx = {
    clients,
    route,
    theme,
    navigate: setRoute,
    addClient,
    removeClient,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
