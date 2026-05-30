'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Message, Route, Session, Theme } from '../lib/types'

type AppApi = {
  sessions: Session[]
  theme: Theme
  route: Route
  selectedSessionId: string | null
  assign: (id: string, agent: string) => void
  close: (id: string) => void
  sendMessage: (id: string, from: 'visitor' | 'agent', text: string) => void
  selectSession: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_SESSIONS: Session[] = [
  { id: 's1', visitor: 'dana', topic: 'Cannot check out', status: 'waiting', agent: null, messages: [{ id: 'm1', from: 'visitor', text: 'Hi, my cart is stuck.' }] },
  { id: 's2', visitor: 'evan', topic: 'Refund status', status: 'active', agent: 'alice', messages: [{ id: 'm2', from: 'agent', text: 'Hello, how can I help?' }] },
  { id: 's3', visitor: 'fran', topic: 'Password help', status: 'closed', agent: 'bob', messages: [] },
  { id: 's4', visitor: 'gita', topic: 'Shipping delay', status: 'waiting', agent: null, messages: [] },
  { id: 's5', visitor: 'hank', topic: 'Account locked', status: 'active', agent: 'alice', messages: [] },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>(SEED_SESSIONS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('queue')
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [nextMsgId, setNextMsgId] = useState(3)

  const value = useMemo<AppApi>(() => {
    const assign = (id: string, agent: string) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, agent, status: 'active' } : s)),
      )
    }
    const close = (id: string) => {
      setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'closed' } : s)))
    }
    const sendMessage = (id: string, from: 'visitor' | 'agent', text: string) => {
      const mid = `m${nextMsgId}`
      setNextMsgId((n) => n + 1)
      const m: Message = { id: mid, from, text }
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, messages: [...s.messages, m] } : s)),
      )
    }
    const selectSession = (id: string) => {
      setSelectedSessionId(id)
      setRoute('session')
    }
    const navigate = (next: Route) => setRoute(next)

    return {
      sessions,
      theme,
      route,
      selectedSessionId,
      assign,
      close,
      sendMessage,
      selectSession,
      setTheme,
      navigate,
    }
  }, [sessions, theme, route, selectedSessionId, nextMsgId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
