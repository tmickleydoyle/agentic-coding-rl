'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Appointment, Provider, Route, Theme } from '../lib/types'
import { TODAY } from '../lib/types'

type BookInput = {
  providerId: string
  date: string
  patient: string
}

type AppApi = {
  providers: Provider[]
  appointments: Appointment[]
  today: string
  theme: Theme
  route: Route
  selectedProviderId: string | null
  selectProvider: (id: string) => void
  availableSlots: (providerId: string) => string[]
  book: (input: BookInput) => boolean
  cancel: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  providers: [],
  appointments: [],
  today: TODAY,
  theme: 'light',
  route: 'providers',
  selectedProviderId: null,
  selectProvider: () => {},
  availableSlots: () => [],
  book: () => false,
  cancel: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold providers/appointments/theme/route/selectedProviderId in state (seed 3
  // providers + 2 appointments), implement selectProvider/availableSlots/book/cancel/navigate,
  // and provide them through AppContext. The STUB below mounts but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
