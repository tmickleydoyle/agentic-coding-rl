'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Request, Route, Status, Priority } from '../lib/types'

const SEED: Request[] = [
  { id: 1, title: 'Homepage redesign', priority: 'high', status: 'in-progress' },
  { id: 2, title: 'Logo refresh', priority: 'medium', status: 'new' },
  { id: 3, title: 'Icon set', priority: 'low', status: 'done' },
]

type Ctx = {
  requests: Request[]
  filter: Status | 'all'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addRequest: (title: string, priority: Priority) => void
  setStatus: (id: number, status: Status) => void
  setFilter: (f: Status | 'all') => void
  toggleTheme: () => void
  clearAll: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<Request[]>(SEED)
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('queue')
  const [nextId, setNextId] = useState(4)

  function addRequest(title: string, priority: Priority) {
    const t = title.trim()
    if (!t) return
    setRequests((rs) => [...rs, { id: nextId, title: t, priority, status: 'new' }])
    setNextId((n) => n + 1)
  }

  function setStatus(id: number, status: Status) {
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const value: Ctx = {
    requests,
    filter,
    theme,
    route,
    navigate: setRoute,
    addRequest,
    setStatus,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    clearAll: () => setRequests([]),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
