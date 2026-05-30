'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Activity, Route, Theme, Trip } from '../lib/types'

type NewActivityInput = {
  tripId: string
  day: number
  title: string
  cost: number
}

type ItineraryApi = {
  trips: Trip[]
  activities: Activity[]
  theme: Theme
  route: Route
  selectedTripId: string | null
  addActivity: (input: NewActivityInput) => void
  removeActivity: (id: string) => void
  moveActivityUp: (id: string) => void
  moveActivityDown: (id: string) => void
  selectTrip: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const ItineraryContext = createContext<ItineraryApi | null>(null)

const SEED_TRIPS: Trip[] = [
  { id: 'tr1', name: 'Japan Spring', destination: 'Tokyo', days: 3 },
  { id: 'tr2', name: 'Italy Tour', destination: 'Rome', days: 2 },
]

const SEED_ACTIVITIES: Activity[] = [
  { id: 'a1', tripId: 'tr1', day: 1, title: 'Shibuya walk', cost: 0 },
  { id: 'a2', tripId: 'tr1', day: 1, title: 'Sushi dinner', cost: 60 },
  { id: 'a3', tripId: 'tr1', day: 2, title: 'Mt Fuji tour', cost: 120 },
  { id: 'a4', tripId: 'tr2', day: 1, title: 'Colosseum', cost: 25 },
]

// Swap the two activities at positions within the same trip+day, preserving the
// relative order of all other activities in the global list.
function swapWithinDay(
  list: Activity[],
  id: string,
  dir: -1 | 1,
): Activity[] {
  const target = list.find((a) => a.id === id)
  if (!target) return list
  const group = list.filter((a) => a.tripId === target.tripId && a.day === target.day)
  const pos = group.findIndex((a) => a.id === id)
  const otherPos = pos + dir
  if (otherPos < 0 || otherPos >= group.length) return list
  const other = group[otherPos]
  return list.map((a) => {
    if (a.id === target.id) return other
    if (a.id === other.id) return target
    return a
  })
}

export function ItineraryProvider({ children }: { children: ReactNode }) {
  const [trips] = useState<Trip[]>(SEED_TRIPS)
  const [activities, setActivities] = useState<Activity[]>(SEED_ACTIVITIES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('trips')
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(5)

  const value = useMemo<ItineraryApi>(() => {
    const addActivity = (input: NewActivityInput) => {
      const id = `a${nextId}`
      setNextId((n) => n + 1)
      setActivities((prev) => [
        ...prev,
        {
          id,
          tripId: input.tripId,
          day: input.day,
          title: input.title,
          cost: input.cost,
        },
      ])
    }

    const removeActivity = (id: string) => {
      setActivities((prev) => prev.filter((a) => a.id !== id))
    }

    const moveActivityUp = (id: string) => {
      setActivities((prev) => swapWithinDay(prev, id, -1))
    }

    const moveActivityDown = (id: string) => {
      setActivities((prev) => swapWithinDay(prev, id, 1))
    }

    const selectTrip = (id: string) => {
      setSelectedTripId(id)
      setRoute('trip-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      trips,
      activities,
      theme,
      route,
      selectedTripId,
      addActivity,
      removeActivity,
      moveActivityUp,
      moveActivityDown,
      selectTrip,
      setTheme,
      navigate,
    }
  }, [trips, activities, theme, route, selectedTripId, nextId])

  return <ItineraryContext.Provider value={value}>{children}</ItineraryContext.Provider>
}

export function useItinerary(): ItineraryApi {
  const v = useContext(ItineraryContext)
  if (!v) throw new Error('useItinerary must be used within an ItineraryProvider')
  return v
}
