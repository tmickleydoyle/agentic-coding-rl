'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { DesignRequest, Priority, Route, Status } from '../lib/types'

const SEED: DesignRequest[] = [
  { id: 1, title: 'Logo redesign', priority: 'high', status: 'new' },
  { id: 2, title: 'Banner artwork', priority: 'medium', status: 'in-progress' },
  { id: 3, title: 'Icon set', priority: 'low', status: 'done' },
]

type Ctx = {
  requests: DesignRequest[]
  filter: Status | 'all'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addRequest: (title: string, priority: Priority) => void
  setInProgress: (id: number) => void
  setDone: (id: number) => void
  setFilter: (f: Status | 'all') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<DesignRequest[]>(SEED)
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('queue')
  const [nextId, setNextId] = useState(4)

  function addRequest(title: string, priority: Priority) {
    const t = title.trim()
    if (!t) return
    setRequests((r) => [...r, { id: nextId, title: t, priority, status: 'new' }])
    setNextId((n) => n + 1)
  }

  function setInProgress(id: number) {
    setRequests((r) =>
      r.map((req) => (req.id === id ? { ...req, status: 'in-progress' as Status } : req))
    )
  }

  function setDone(id: number) {
    setRequests((r) =>
      r.map((req) => (req.id === id ? { ...req, status: 'done' as Status } : req))
    )
  }

  const value: Ctx = {
    requests,
    filter,
    theme,
    route,
    navigate: setRoute,
    addRequest,
    setInProgress,
    setDone,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
