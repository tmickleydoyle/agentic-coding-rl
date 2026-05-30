'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Booking, Route, Service, Theme } from '../lib/types'
import { SLOTS } from '../lib/types'

type BookInput = {
  serviceId: string
  slot: string
  customer: string
}

type AppApi = {
  services: Service[]
  bookings: Booking[]
  slots: string[]
  theme: Theme
  route: Route
  selectedServiceId: string | null
  selectService: (id: string) => void
  book: (input: BookInput) => boolean
  cancel: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_SERVICES: Service[] = [
  { id: 's1', name: 'Haircut', durationMin: 30 },
  { id: 's2', name: 'Massage', durationMin: 60 },
  { id: 's3', name: 'Consultation', durationMin: 45 },
]

const SEED_BOOKINGS: Booking[] = [
  { id: 'b1', serviceId: 's1', slot: '09:00', customer: 'Ada' },
  { id: 'b2', serviceId: 's2', slot: '10:00', customer: 'Grace' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [services] = useState<Service[]>(SEED_SERVICES)
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('services')
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(3)

  const value = useMemo<AppApi>(() => {
    const selectService = (id: string) => {
      setSelectedServiceId(id)
      setRoute('book')
    }

    const book = (input: BookInput): boolean => {
      const taken = bookings.some(
        (b) => b.serviceId === input.serviceId && b.slot === input.slot,
      )
      if (taken) return false
      const id = `b${nextId}`
      setNextId((n) => n + 1)
      setBookings((prev) => [
        ...prev,
        { id, serviceId: input.serviceId, slot: input.slot, customer: input.customer },
      ])
      return true
    }

    const cancel = (id: string) => {
      setBookings((prev) => prev.filter((b) => b.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      services,
      bookings,
      slots: SLOTS,
      theme,
      route,
      selectedServiceId,
      selectService,
      book,
      cancel,
      setTheme,
      navigate,
    }
  }, [services, bookings, theme, route, selectedServiceId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
