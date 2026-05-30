'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Event, Route, Rsvp, Theme, TimeFilter } from '../lib/types'

type NewEventInput = {
  title: string
  day: number
}

type AppApi = {
  events: Event[]
  theme: Theme
  route: Route
  selectedId: string | null
  timeFilter: TimeFilter
  selectEvent: (id: string) => void
  setRsvp: (id: string, rsvp: Rsvp) => void
  addEvent: (input: NewEventInput) => void
  setTimeFilter: (filter: TimeFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  events: [],
  theme: 'light',
  route: 'events',
  selectedId: null,
  timeFilter: 'all',
  selectEvent: () => {},
  setRsvp: () => {},
  addEvent: () => {},
  setTimeFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold events/theme/route/selectedId/timeFilter in state (seed 3 events), implement
  // selectEvent/setRsvp/addEvent/navigate, and provide them through AppContext. The STUB
  // below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useEvents(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useEvents must be used within an AppStateProvider')
  return v
}
