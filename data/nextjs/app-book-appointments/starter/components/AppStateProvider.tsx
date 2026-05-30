'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: AppApi = {
  services: [],
  bookings: [],
  slots: SLOTS,
  theme: 'light',
  route: 'services',
  selectedServiceId: null,
  selectService: () => {},
  book: () => false,
  cancel: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold services/bookings/theme/route/selectedServiceId in state (seed 3 services +
  // 2 bookings), implement selectService/book/cancel/navigate, and provide them through
  // AppContext. The STUB below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
