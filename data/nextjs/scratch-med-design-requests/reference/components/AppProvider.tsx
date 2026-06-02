'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Priority, Request, Route, StatusFilter, RequestStatus } from '../lib/types'

type Ctx = {
  requests: Request[]
  filter: StatusFilter
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addRequest: (title: string, priority: Priority) => void
  setStatus: (id: number, status: RequestStatus) => void
  setFilter: (f: StatusFilter) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<Request[]>([])
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('queue')
  const [nextId, setNextId] = useState(1)

  function addRequest(title: string, priority: Priority) {
    const t = title.trim()
    if (!t) return
    setRequests((r) => [...r, { id: nextId, title: t, priority, status: 'new' }])
    setNextId((n) => n + 1)
  }

  function setStatus(id: number, status: RequestStatus) {
    setRequests((r) => r.map((req) => (req.id === id ? { ...req, status } : req)))
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
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
