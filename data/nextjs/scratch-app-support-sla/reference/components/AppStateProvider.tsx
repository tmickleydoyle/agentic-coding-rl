'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Route, Theme, Ticket } from '../lib/types'
import { bumpPriority } from '../lib/types'

type AppApi = {
  tickets: Ticket[]
  theme: Theme
  route: Route
  selectedTicketId: string | null
  respond: (id: string) => void
  escalate: (id: string) => void
  selectTicket: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_TICKETS: Ticket[] = [
  { id: 'k1', subject: 'Login outage', priority: 'high', slaMinutes: 60, elapsedMinutes: 90, responded: false, escalated: false },
  { id: 'k2', subject: 'Billing inquiry', priority: 'normal', slaMinutes: 120, elapsedMinutes: 30, responded: false, escalated: false },
  { id: 'k3', subject: 'Data loss report', priority: 'urgent', slaMinutes: 30, elapsedMinutes: 45, responded: false, escalated: false },
  { id: 'k4', subject: 'Feature question', priority: 'low', slaMinutes: 240, elapsedMinutes: 300, responded: true, escalated: false },
  { id: 'k5', subject: 'Slow page loads', priority: 'high', slaMinutes: 60, elapsedMinutes: 70, responded: false, escalated: false },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(SEED_TICKETS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('tickets')
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const respond = (id: string) => {
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, responded: true } : t)))
    }
    const escalate = (id: string) => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, escalated: true, priority: bumpPriority(t.priority) } : t,
        ),
      )
    }
    const selectTicket = (id: string) => {
      setSelectedTicketId(id)
      setRoute('ticket-detail')
    }
    const navigate = (next: Route) => setRoute(next)

    return { tickets, theme, route, selectedTicketId, respond, escalate, selectTicket, setTheme, navigate }
  }, [tickets, theme, route, selectedTicketId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
