'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Booking, Room, Route, Theme } from '../lib/types'
import { overlaps } from '../lib/types'

type BookInput = {
  roomId: string
  start: number
  end: number
  title: string
}

type AppApi = {
  rooms: Room[]
  bookings: Booking[]
  theme: Theme
  route: Route
  selectedRoomId: string | null
  selectRoom: (id: string) => void
  book: (input: BookInput) => boolean
  cancel: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_ROOMS: Room[] = [
  { id: 'm1', name: 'Aspen', floor: 1 },
  { id: 'm2', name: 'Birch', floor: 2 },
  { id: 'm3', name: 'Cedar', floor: 3 },
]

const SEED_BOOKINGS: Booking[] = [
  { id: 'k1', roomId: 'm1', start: 9, end: 10, title: 'Standup' },
  { id: 'k2', roomId: 'm2', start: 13, end: 14, title: 'Review' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [rooms] = useState<Room[]>(SEED_ROOMS)
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('rooms')
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(3)

  const value = useMemo<AppApi>(() => {
    const selectRoom = (id: string) => {
      setSelectedRoomId(id)
      setRoute('book')
    }

    const book = (input: BookInput): boolean => {
      if (!(input.start < input.end)) return false
      const conflict = bookings.some(
        (b) => b.roomId === input.roomId && overlaps(b.start, b.end, input.start, input.end),
      )
      if (conflict) return false
      const id = `k${nextId}`
      setNextId((n) => n + 1)
      setBookings((prev) => [
        ...prev,
        {
          id,
          roomId: input.roomId,
          start: input.start,
          end: input.end,
          title: input.title,
        },
      ])
      return true
    }

    const cancel = (id: string) => {
      setBookings((prev) => prev.filter((b) => b.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      rooms,
      bookings,
      theme,
      route,
      selectedRoomId,
      selectRoom,
      book,
      cancel,
      setTheme,
      navigate,
    }
  }, [rooms, bookings, theme, route, selectedRoomId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
