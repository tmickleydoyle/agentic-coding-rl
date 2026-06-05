'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Incident, Priority } from '../lib/types'

type Ctx = {
  route: Route
  incidents: Incident[]
  navigate: (r: Route) => void
  logIncident: (title: string, priority: Priority, hours: string) => void
  resolveIncident: (id: number) => void
}

export const PlatformContext = createContext<Ctx | null>(null)

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>('incidents')
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [nextId, setNextId] = useState(1)

  function logIncident(title: string, priority: Priority, hours: string) {
    const t = title.trim()
    if (!t) return
    let h = Math.floor(parseFloat(hours))
    if (!isFinite(h) || h < 0) h = 0
    setIncidents((xs) => [...xs, { id: nextId, title: t, priority, hours: h, active: true }])
    setNextId((n) => n + 1)
  }

  function resolveIncident(id: number) {
    setIncidents((xs) => xs.map((x) => (x.id === id ? { ...x, active: false } : x)))
  }

  const value: Ctx = {
    route,
    incidents,
    navigate: setRoute,
    logIncident,
    resolveIncident,
  }
  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
}
