'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Reservation, Route, Table, Theme } from '../lib/types'
import { TIMES } from '../lib/types'

type ReserveInput = {
  tableId: string
  time: string
  party: number
  name: string
}

type AppApi = {
  tables: Table[]
  reservations: Reservation[]
  times: string[]
  theme: Theme
  route: Route
  availableTables: (time: string, party: number) => Table[]
  reserve: (input: ReserveInput) => boolean
  cancel: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  tables: [],
  reservations: [],
  times: TIMES,
  theme: 'light',
  route: 'availability',
  availableTables: () => [],
  reserve: () => false,
  cancel: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold tables/reservations/theme/route in state (seed 3 tables + 2 reservations),
  // implement availableTables/reserve/cancel/navigate, and provide them through AppContext.
  // The STUB below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
