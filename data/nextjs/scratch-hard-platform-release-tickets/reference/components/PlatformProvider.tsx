'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Release, Ticket } from '../lib/types'

type Ctx = {
  route: Route
  releases: Release[]
  tickets: Ticket[]
  navigate: (r: Route) => void
  addRelease: (name: string) => void
  addTicket: (releaseId: string, summary: string, points: string) => void
  resolveTicket: (id: number) => void
}

export const PlatformContext = createContext<Ctx | null>(null)

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>('releases')
  const [releases, setReleases] = useState<Release[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [nextRelease, setNextRelease] = useState(1)
  const [nextTicket, setNextTicket] = useState(1)

  function addRelease(name: string) {
    const n = name.trim()
    if (!n) return
    setReleases((r) => [...r, { id: nextRelease, name: n }])
    setNextRelease((n) => n + 1)
  }

  function addTicket(releaseId: string, summary: string, points: string) {
    const s = summary.trim()
    const rid = parseInt(releaseId, 10)
    if (!s || !isFinite(rid)) return
    if (!releases.some((r) => r.id === rid)) return
    let pts = Math.floor(parseFloat(points))
    if (!isFinite(pts) || pts < 1) pts = 1
    setTickets((t) => [...t, { id: nextTicket, summary: s, releaseId: rid, points: pts, done: false }])
    setNextTicket((n) => n + 1)
  }

  function resolveTicket(id: number) {
    setTickets((t) => t.map((x) => (x.id === id ? { ...x, done: true } : x)))
  }

  const value: Ctx = {
    route,
    releases,
    tickets,
    navigate: setRoute,
    addRelease,
    addTicket,
    resolveTicket,
  }
  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
}
