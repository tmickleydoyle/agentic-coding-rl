'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Trainer, Session } from '../lib/types'

type Ctx = {
  trainers: Trainer[]
  sessions: Session[]
  theme: 'light' | 'dark'
  hideAvailable: boolean
  route: Route
  navigate: (r: Route) => void
  addTrainer: (name: string, cap: string) => void
  addSession: (trainerId: string, client: string, hours: string) => void
  toggleTheme: () => void
  toggleHideAvailable: () => void
}

export const StudioContext = createContext<Ctx | null>(null)

export function StudioProvider({ children }: { children: ReactNode }) {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideAvailable, setHideAvailable] = useState(false)
  const [route, setRoute] = useState<Route>('trainers')
  const [nextTrainerId, setNextTrainerId] = useState(1)
  const [nextSessionId, setNextSessionId] = useState(1)

  function addTrainer(name: string, cap: string) {
    const c = parseInt(cap, 10)
    const trimmed = name.trim()
    if (!trimmed || !isFinite(c) || c <= 0) return
    setTrainers((t) => [...t, { id: nextTrainerId, name: trimmed, cap: c }])
    setNextTrainerId((n) => n + 1)
  }

  function addSession(trainerId: string, client: string, hours: string) {
    const tid = parseInt(trainerId, 10)
    const h = parseInt(hours, 10)
    const trimmed = client.trim()
    if (!trainers.some((t) => t.id === tid) || !trimmed || !isFinite(h) || h <= 0) return
    setSessions((s) => [...s, { id: nextSessionId, trainerId: tid, client: trimmed, hours: h }])
    setNextSessionId((n) => n + 1)
  }

  const value: Ctx = {
    trainers,
    sessions,
    theme,
    hideAvailable,
    route,
    navigate: setRoute,
    addTrainer,
    addSession,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideAvailable: () => setHideAvailable((s) => !s),
  }
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
}
