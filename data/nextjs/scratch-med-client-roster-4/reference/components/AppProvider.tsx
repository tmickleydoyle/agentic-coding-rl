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

const SEED: Omit<Client, 'id'>[] = [
  { name: 'Acme Corp', status: 'active', value: 4200 },
  { name: 'Globex', status: 'lead', value: 850 },
  { name: 'Initech', status: 'churned', value: 3100 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(
    SEED.map((s, i) => ({ ...s, id: i + 1 }))
  )
  const [nextId, setNextId] = useState(SEED.length + 1)
  const [filter, setFilter] = useState<ClientStatus | 'all'>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('roster')

  function addClient(name: string, status: ClientStatus, value: number) {
    const n = name.trim()
    if (!n || value <= 0) return
    setClients((c) => [...c, { id: nextId, name: n, status, value }])
    setNextId((id) => id + 1)
  }

  function removeClient(id: number) {
    setClients((c) => c.filter((x) => x.id !== id))
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
