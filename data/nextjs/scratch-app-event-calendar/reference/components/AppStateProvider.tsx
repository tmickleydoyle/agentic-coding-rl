'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { EventItem, Route, Theme } from '../lib/types'
import { DAYS_IN_MONTH } from '../lib/types'

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

const SEED_EVENTS: EventItem[] = [
  { id: 'v1', title: 'Standup', day: 2, category: 'work' },
  { id: 'v2', title: 'Lunch', day: 2, category: 'social' },
  { id: 'v3', title: 'Gym', day: 15, category: 'personal' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>(SEED_EVENTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('month')
  const [filter, setFilter] = useState<string>('all')
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const visibleEvents =
      filter === 'all' ? events : events.filter((e) => e.category === filter)

    const eventsOn = (day: number): EventItem[] =>
      visibleEvents.filter((e) => e.day === day)

    const selectDay = (day: number) => {
      setSelectedDay(day)
      setRoute('event-detail')
    }

    const addEvent = (title: string, day: number, category: string): string | null => {
      if (title.trim().length === 0) return null
      if (!Number.isInteger(day) || day < 1 || day > DAYS_IN_MONTH) return null
      const id = `v${nextId}`
      setNextId((n) => n + 1)
      setEvents((prev) => [
        ...prev,
        { id, title: title.trim(), day, category },
      ])
      return id
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      events,
      theme,
      route,
      filter,
      selectedDay,
      visibleEvents,
      selectDay,
      setFilter,
      eventsOn,
      addEvent,
      setTheme,
      navigate,
    }
  }, [events, theme, route, filter, selectedDay, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
