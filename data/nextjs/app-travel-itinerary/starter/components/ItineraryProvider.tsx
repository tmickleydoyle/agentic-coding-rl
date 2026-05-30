'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: ItineraryApi = {
  trips: [],
  activities: [],
  theme: 'light',
  route: 'trips',
  selectedTripId: null,
  addActivity: () => {},
  removeActivity: () => {},
  moveActivityUp: () => {},
  moveActivityDown: () => {},
  selectTrip: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function ItineraryProvider({ children }: { children: ReactNode }) {
  // TODO: hold trips/activities/theme/route/selectedTripId in state (seed 2 trips + 4
  // activities), implement the actions (including reorder-within-day), and provide them
  // through ItineraryContext. Replace the STUB below with real state + actions.
  return <ItineraryContext.Provider value={STUB}>{children}</ItineraryContext.Provider>
}

export function useItinerary(): ItineraryApi {
  const v = useContext(ItineraryContext)
  if (!v) throw new Error('useItinerary must be used within an ItineraryProvider')
  return v
}
