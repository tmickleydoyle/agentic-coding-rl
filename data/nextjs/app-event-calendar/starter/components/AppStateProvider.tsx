'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { EventItem, Route, Theme } from '../lib/types'

type AppApi = {
  events: EventItem[]
  theme: Theme
  route: Route
  filter: string
  selectedDay: number | null
  visibleEvents: EventItem[]
  selectDay: (day: number) => void
  setFilter: (category: string) => void
  eventsOn: (day: number) => EventItem[]
  addEvent: (title: string, day: number, category: string) => string | null
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  events: [],
  theme: 'light',
  route: 'month',
  filter: 'all',
  selectedDay: null,
  visibleEvents: [],
  selectDay: () => {},
  setFilter: () => {},
  eventsOn: () => [],
  addEvent: () => null,
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold events/theme/route/filter/selectedDay in state (seed 3 events); implement
  // visibleEvents/eventsOn/selectDay/setFilter/addEvent/navigate, and provide them through
  // AppContext. The STUB makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
