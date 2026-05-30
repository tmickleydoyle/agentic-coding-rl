'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Booking, Room, Route, Theme } from '../lib/types'

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

const STUB: AppApi = {
  rooms: [],
  bookings: [],
  theme: 'light',
  route: 'rooms',
  selectedRoomId: null,
  selectRoom: () => {},
  book: () => false,
  cancel: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold rooms/bookings/theme/route/selectedRoomId in state (seed 3 rooms +
  // 2 bookings), implement selectRoom/book/cancel/navigate with interval-overlap conflict
  // detection, and provide them through AppContext. The STUB below mounts but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
