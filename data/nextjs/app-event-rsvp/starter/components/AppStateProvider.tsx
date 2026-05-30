'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { EventItem, Route, Rsvp, Theme } from '../lib/types'

type AppApi = {
  events: EventItem[]
  theme: Theme
  route: Route
  selectedEventId: string | null
  selectedInviteId: string | null
  selectEvent: (id: string) => void
  selectInvite: (eventId: string, inviteId: string) => void
  headcount: (eventId: string) => number
  respond: (
    eventId: string,
    inviteId: string,
    status: Rsvp,
    extraGuests: number,
  ) => boolean
  addEvent: (name: string, date: string) => string | null
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  events: [],
  theme: 'light',
  route: 'events',
  selectedEventId: null,
  selectedInviteId: null,
  selectEvent: () => {},
  selectInvite: () => {},
  headcount: () => 0,
  respond: () => false,
  addEvent: () => null,
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold events/theme/route/selectedEventId/selectedInviteId in state (seed 2 events);
  // implement selectEvent/selectInvite/headcount/respond/addEvent/navigate, and provide them
  // through AppContext. The STUB makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
