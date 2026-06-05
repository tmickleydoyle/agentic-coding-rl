'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Route, Session, Theme } from '../lib/types'

type AppApi = {
  sessions: Session[]
  agenda: string[]
  theme: Theme
  route: Route
  selectedSessionId: string | null
  selectSession: (id: string) => void
  inAgenda: (id: string) => boolean
  conflictsWith: (id: string) => string | null
  addToAgenda: (id: string) => boolean
  removeFromAgenda: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_SESSIONS: Session[] = [
  { id: 's1', title: 'Intro to RL', track: 'AI', slot: '09:00', speaker: 'Ada' },
  { id: 's2', title: 'Vector DBs', track: 'Data', slot: '10:00', speaker: 'Grace' },
  { id: 's3', title: 'Edge Caching', track: 'Web', slot: '09:00', speaker: 'Linus' },
  { id: 's4', title: 'GPU Tuning', track: 'AI', slot: '11:00', speaker: 'Edsger' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [sessions] = useState<Session[]>(SEED_SESSIONS)
  const [agenda, setAgenda] = useState<string[]>(['s1'])
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('schedule')
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const inAgenda = (id: string): boolean => agenda.indexOf(id) !== -1

    const conflictsWith = (id: string): string | null => {
      const target = sessions.find((s) => s.id === id)
      if (!target) return null
      let found: string | null = null
      agenda.forEach((aid) => {
        if (found) return
        if (aid === id) return
        const other = sessions.find((s) => s.id === aid)
        if (other && other.slot === target.slot) found = aid
      })
      return found
    }

    const selectSession = (id: string) => {
      setSelectedSessionId(id)
      setRoute('session-detail')
    }

    const addToAgenda = (id: string): boolean => {
      const target = sessions.find((s) => s.id === id)
      if (!target) return false
      if (agenda.indexOf(id) !== -1) return false
      if (conflictsWith(id)) return false
      setAgenda((prev) => [...prev, id])
      return true
    }

    const removeFromAgenda = (id: string) => {
      setAgenda((prev) => prev.filter((a) => a !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      sessions,
      agenda,
      theme,
      route,
      selectedSessionId,
      selectSession,
      inAgenda,
      conflictsWith,
      addToAgenda,
      removeFromAgenda,
      setTheme,
      navigate,
    }
  }, [sessions, agenda, theme, route, selectedSessionId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
