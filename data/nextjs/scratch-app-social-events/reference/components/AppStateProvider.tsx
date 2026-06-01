'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_EVENTS: Event[] = [
  { id: 'e1', title: 'Park Cleanup', day: 120, rsvp: 'going', going: 8 },
  { id: 'e2', title: 'Book Club', day: 90, rsvp: null, going: 4 },
  { id: 'e3', title: 'Hack Night', day: 130, rsvp: 'maybe', going: 12 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(SEED_EVENTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('events')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const selectEvent = (id: string) => {
      setSelectedId(id)
      setRoute('event-detail')
    }

    const setRsvp = (id: string, rsvp: Rsvp) => {
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, rsvp } : e)))
    }

    const addEvent = (input: NewEventInput) => {
      const id = `e${nextId}`
      setNextId((n) => n + 1)
      setEvents((prev) => [
        ...prev,
        { id, title: input.title, day: input.day, rsvp: null, going: 0 },
      ])
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      events,
      theme,
      route,
      selectedId,
      timeFilter,
      selectEvent,
      setRsvp,
      addEvent,
      setTimeFilter,
      setTheme,
      navigate,
    }
  }, [events, theme, route, selectedId, timeFilter, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useEvents(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useEvents must be used within an AppStateProvider')
  return v
}
