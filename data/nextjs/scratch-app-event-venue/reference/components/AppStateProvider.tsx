'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Booking, Route, Theme, Venue } from '../lib/types'
import { DATES } from '../lib/types'

type BookInput = {
  venueId: string
  date: string
  attendees: number
  organizer: string
}

type AppApi = {
  venues: Venue[]
  bookings: Booking[]
  dates: string[]
  theme: Theme
  route: Route
  selectedVenueId: string | null
  selectVenue: (id: string) => void
  isAvailable: (venueId: string, date: string) => boolean
  bookingsFor: (venueId: string) => Booking[]
  book: (input: BookInput) => boolean
  cancel: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_VENUES: Venue[] = [
  { id: 'g1', name: 'Grand Hall', capacity: 200 },
  { id: 'g2', name: 'Studio B', capacity: 40 },
]

const SEED_BOOKINGS: Booking[] = [
  { id: 'b1', venueId: 'g1', date: '2026-06-01', attendees: 150, organizer: 'Ada' },
  { id: 'b2', venueId: 'g2', date: '2026-06-02', attendees: 30, organizer: 'Grace' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [venues] = useState<Venue[]>(SEED_VENUES)
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('venues')
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(3)

  const value = useMemo<AppApi>(() => {
    const isAvailable = (venueId: string, date: string): boolean =>
      !bookings.some((b) => b.venueId === venueId && b.date === date)

    const bookingsFor = (venueId: string): Booking[] =>
      bookings.filter((b) => b.venueId === venueId)

    const selectVenue = (id: string) => {
      setSelectedVenueId(id)
      setRoute('venue-detail')
    }

    const book = (input: BookInput): boolean => {
      const venue = venues.find((v) => v.id === input.venueId)
      if (!venue) return false
      if (input.organizer.trim().length === 0) return false
      if (!Number.isInteger(input.attendees) || input.attendees <= 0) return false
      if (input.attendees > venue.capacity) return false
      if (!isAvailable(input.venueId, input.date)) return false
      const id = `b${nextId}`
      setNextId((n) => n + 1)
      setBookings((prev) => [
        ...prev,
        {
          id,
          venueId: input.venueId,
          date: input.date,
          attendees: input.attendees,
          organizer: input.organizer.trim(),
        },
      ])
      return true
    }

    const cancel = (id: string) => {
      setBookings((prev) => prev.filter((b) => b.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      venues,
      bookings,
      dates: DATES,
      theme,
      route,
      selectedVenueId,
      selectVenue,
      isAvailable,
      bookingsFor,
      book,
      cancel,
      setTheme,
      navigate,
    }
  }, [venues, bookings, theme, route, selectedVenueId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
