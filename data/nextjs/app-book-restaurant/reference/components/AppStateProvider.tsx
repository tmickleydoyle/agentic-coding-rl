'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_TABLES: Table[] = [
  { id: 't1', name: 'T1 Window', capacity: 2 },
  { id: 't2', name: 'T2 Booth', capacity: 4 },
  { id: 't3', name: 'T3 Patio', capacity: 6 },
]

const SEED_RESERVATIONS: Reservation[] = [
  { id: 'r1', tableId: 't1', time: '19:00', party: 2, name: 'Ada' },
  { id: 'r2', tableId: 't2', time: '20:00', party: 3, name: 'Grace' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [tables] = useState<Table[]>(SEED_TABLES)
  const [reservations, setReservations] = useState<Reservation[]>(SEED_RESERVATIONS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('availability')
  const [nextId, setNextId] = useState(3)

  const value = useMemo<AppApi>(() => {
    const availableTables = (time: string, party: number): Table[] =>
      tables.filter(
        (t) =>
          t.capacity >= party &&
          !reservations.some((r) => r.tableId === t.id && r.time === time),
      )

    const reserve = (input: ReserveInput): boolean => {
      const table = tables.find((t) => t.id === input.tableId)
      if (!table) return false
      if (table.capacity < input.party) return false
      const taken = reservations.some(
        (r) => r.tableId === input.tableId && r.time === input.time,
      )
      if (taken) return false
      const id = `r${nextId}`
      setNextId((n) => n + 1)
      setReservations((prev) => [
        ...prev,
        {
          id,
          tableId: input.tableId,
          time: input.time,
          party: input.party,
          name: input.name,
        },
      ])
      return true
    }

    const cancel = (id: string) => {
      setReservations((prev) => prev.filter((r) => r.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      tables,
      reservations,
      times: TIMES,
      theme,
      route,
      availableTables,
      reserve,
      cancel,
      setTheme,
      navigate,
    }
  }, [tables, reservations, theme, route, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
